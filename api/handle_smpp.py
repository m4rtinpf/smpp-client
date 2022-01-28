import queue
import threading
import logging
import sys
from queue import Queue
import smpplib.gsm
import smpplib.client
import smpplib.consts
from .models import ClientModel, MessageModel


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

        self.client_instance = ClientModel.objects.get(sessionId=session_id)

    def run(self):
        # if you want to know what's happening
        logging.basicConfig(
            level='DEBUG',
            format='%(asctime)s %(levelname)s %(module)s - %(funcName)s: %(message)s',
        )

        smpplib_client = smpplib.client.Client(
            host=self.hostname,
            port=self.port,
            allow_unknown_opt_params=True,
        )

        # Print when obtain message_id
        smpplib_client.set_message_sent_handler(
            lambda pdu: sys.stdout.write('sent {} {}\n'.format(pdu.sequence, pdu.message_id)))
        smpplib_client.set_message_received_handler(
            lambda pdu: sys.stdout.write('delivered {}\n'.format(pdu.receipted_message_id)))

        smpplib_client.connect()

        resp = smpplib_client.bind_transceiver(
            system_id=self.system_id,
            password=self.password,
        )

        if smpplib_client.state == smpplib.consts.SMPP_CLIENT_STATE_BOUND_TRX:
            print('Client bound as transceiver')

            self.client_instance.isBound = True
            self.client_instance.save()
            self.event.set()

            rx_thread = RxThread(smpplib_client)
            rx_thread.start()

        # Create a queue
        q = Queue()

        while not self.client_instance.isDone:
            # .save() and .refresh_from_db() ?
            queryset = MessageModel.objects.filter(client=self.client_instance)
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
                        pdu = smpplib_client.send_message(
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
                # print('Empty queue')

        print(
            f"Exiting thread {threading.currentThread().getName()} for client with session id {self.session_id} \n")

    # else:
    # print(self.client_instance.isDone)


class RxThread(threading.Thread):
    def __init__(self, smpplib_client):
        threading.Thread.__init__(self)
        self.smpplib_client = smpplib_client

    def run(self):
        self.smpplib_client.listen()
