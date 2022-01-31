import queue
import threading
import logging
import sys
from queue import Queue
import smpplib.gsm
import smpplib.client
import smpplib.consts
from .models import UserModel, MessageModel
from django_eventstream import send_event

smpp_lock = threading.Lock()


class TxThread(threading.Thread):
    def __init__(
            self, system_id, hostname, password, port, system_type, use_ssl, reconnect, session_id, command, event,
    ):
        threading.Thread.__init__(self)

        self.system_id = system_id
        self.hostname = hostname
        self.password = password
        self.port = port
        self.system_type = system_type
        self.use_ssl = use_ssl
        self.reconnect = reconnect
        self.session_id = session_id
        self.command = command
        self.event = event

        self.user = UserModel.objects.get(sessionId=session_id)

    def run(self):

        client = smpplib.client.Client(
            host=self.hostname,
            port=self.port,
            allow_unknown_opt_params=True,
            logger_name='smpplib_logger',
        )

        logging.basicConfig(
            # level='DEBUG',
            # format='%(asctime)s %(levelname)s %(module)s - %(funcName)s: %(message)s',
        )

        handler = LogHandler(client)
        smpplib_logger = logging.getLogger('smpplib_logger')
        smpplib_logger.addHandler(handler)
        smpplib_logger.setLevel('DEBUG')
        # smpplib_logger.setLevel('DEBUG')
        # smpplib_logger.propagate = False

        # Print when obtain message_id
        client.set_message_sent_handler(
            lambda pdu: sys.stdout.write('sent {} {}\n'.format(pdu.sequence, pdu.message_id)))
        client.set_message_received_handler(
            lambda pdu: sys.stdout.write('delivered {}\n'.format(pdu.receipted_message_id)))

        client.connect()

        resp = client.bind_transceiver(
            system_id=self.system_id,
            password=self.password,
        )

        if client.state == smpplib.consts.SMPP_CLIENT_STATE_BOUND_TRX:
            self.event.set()

            rx_thread = RxThread(client)
            rx_thread.start()

        # Create a queue
        q = Queue()

        while not self.user.isDone:
            # .save() and .refresh_from_db() ?
            queryset = MessageModel.objects.filter(user=self.user)
            if queryset.exists():
                for message in queryset:
                    print(f"{message.messageText}")
                    # todo bulk submit
                    q.put(message)
                    message.delete()

            try:
                message = q.get(block=False)
                if message is not None:
                    print("+++++++++++++Begin send++++++++++++++")
                    print(f"Message: {message.messageText}")

                    # Two parts, UCS2, SMS with UDH
                    parts, encoding_flag, msg_type_flag = smpplib.gsm.make_parts(message.messageText)

                    for part in parts:
                        pdu = client.send_message(
                            source_addr_ton=message.sourceAddrTON,
                            source_addr_npi=message.sourceAddrNPI,
                            # Make sure it is a byte string, not unicode:
                            source_addr=message.sourceAddr,

                            dest_addr_ton=message.destAddrTON,
                            dest_addr_npi=message.destAddrNPI,
                            # Make sure these two params are byte strings, not unicode:
                            destination_addr=message.destAddr,
                            short_message=part,

                            data_coding=message.dataCoding,
                            esm_class=msg_type_flag,
                            registered_delivery=True,
                        )
                        print(pdu.sequence)

                    print("+++++++++++++Finish send++++++++++++++")

            except queue.Empty:
                pass

            self.user.refresh_from_db()
        #         print('Empty queue')
        #         self.user.refresh_from_db()
        #
        # print(
        #     f"Exiting thread {threading.currentThread().getName()} for user with session id {self.session_id} \n")
        #
        # # else:
        print('UNBINDING')

        try:
            client.unbind()
            client.disconnect()
        except:
            client.state = smpplib.consts.SMPP_CLIENT_STATE_CLOSED


class RxThread(threading.Thread):
    def __init__(self, client):
        threading.Thread.__init__(self)
        self.client = client

    def run(self):
        while True:
            if self.client.state == smpplib.consts.SMPP_CLIENT_STATE_BOUND_TRX:
                try:
                    self.client.read_once()
                except:
                    break
        print(
            'EXITING THREADDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD')


class LogHandler(logging.Handler):
    def __init__(self, client):
        logging.Handler.__init__(self)
        self.client = client

    def emit(self, record):
        log_entry = self.format(record)

        if self.client.state == smpplib.consts.SMPP_CLIENT_STATE_BOUND_TRX:
            is_bound = True
        else:
            is_bound = False

        return send_event('01', 'message',
                          {
                              'text': log_entry,
                              'isBound': is_bound,
                          }
                          )
