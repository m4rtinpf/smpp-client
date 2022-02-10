import queue
import threading
import logging
import smpplib.gsm
import smpplib.client
import smpplib.consts
import ssl
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json
from .consumers import get_group_name_from_session_id
from .models import users
import time


class TxThread(threading.Thread):
    def __init__(
            self, session_id, command,
    ):
        super().__init__()

        self.session_id = session_id
        self.command = command

    def run(self):
        user = users[self.session_id]
        if user['use_ssl']:
            # todo uncomment when SSL is working (and remove next line)
            # ssl_context = ssl.create_default_context()
            ssl_context = None
        else:
            ssl_context = None

        logger_name = f"smpplib_logger_{self.session_id}"

        client = smpplib.client.Client(
            host=user['hostname'],
            port=user['port'],
            allow_unknown_opt_params=True,
            logger_name=logger_name,
            ssl_context=ssl_context,
        )

        logging.basicConfig(
            # format='%(asctime)s %(levelname)s %(module)s - %(funcName)s: %(message)s',
        )

        handler = LogHandler(client, self.session_id)
        smpplib_logger = logging.getLogger(logger_name)
        smpplib_logger.addHandler(handler)
        smpplib_logger.setLevel('DEBUG')
        # smpplib_logger.propagate = False

        # Print when obtain message_id
        client.set_message_sent_handler(
            lambda pdu: smpplib_logger.info('Sent {} {}\n'.format(pdu.sequence, pdu.message_id)))
        client.set_message_received_handler(
            lambda pdu: smpplib_logger.info('Delivered {}\n'.format(pdu.receipted_message_id)))

        try:
            client.connect()
        except smpplib.exceptions.ConnectionError as e:
            smpplib_logger.error(e)
            # self.event.set()
            return

        try:
            resp = client.bind_transceiver(
                system_id=user['system_id'],
                password=user['password'],
            )
        except (smpplib.exceptions.ConnectionError, smpplib.exceptions.PDUError) as e:
            smpplib_logger.error(e)
            # self.event.set()
            return

        # self.event.set()

        rx_thread = RxThread(client, smpplib_logger, self.session_id)
        rx_thread.start()

        while not user['is_done']:
            try:
                message = user['message_queue'].get(block=False)
                if message is not None:
                    # Two parts, UCS2, SMS with UDH
                    parts, encoding_flag, msg_type_flag = smpplib.gsm.make_parts(message['message_text'])

                    for part in parts:
                        pdu = client.send_message(
                            source_addr_ton=message['source_addr_ton'],
                            source_addr_npi=message['source_addr_npi'],
                            # Make sure it is a byte string, not unicode:
                            source_addr=message['source_addr'],

                            dest_addr_ton=message['dest_addr_ton'],
                            dest_addr_npi=message['dest_addr_npi'],
                            # Make sure these two params are byte strings, not unicode:
                            destination_addr=message['dest_addr'],
                            short_message=part,

                            data_coding=message['data_coding'],
                            esm_class=msg_type_flag,
                            registered_delivery=True,
                        )

            except queue.Empty:
                pass

        # todo fix when thread safe
        try:
            client.unbind()
            client.disconnect()
        except:
            client.state = smpplib.consts.SMPP_CLIENT_STATE_CLOSED
            smpplib_logger.warning('Disconnected with race condition')
        finally:
            smpplib_logger.removeHandler(handler)


class RxThread(threading.Thread):
    def __init__(self, client, smpplib_logger, session_id):
        super().__init__()
        self.client = client
        self.smpplib_logger = smpplib_logger
        self.session_id = session_id

    def run(self):
        channel_layer = get_channel_layer()
        # todo fix when thread safe
        while True:
            try:
                if self.client.state == smpplib.consts.SMPP_CLIENT_STATE_BOUND_TRX:
                    self.client.read_once()
            except:
                self.client.state = smpplib.consts.SMPP_CLIENT_STATE_CLOSED
                self.smpplib_logger.warning('Disconnected with race condition')
                break
            finally:
                if not users[self.session_id]['log_message_queue'].empty():
                    async_to_sync(channel_layer.group_send)(
                        get_group_name_from_session_id(self.session_id),
                        {
                            'type': 'send_message',
                        }
                    )
                    # time.sleep(0.1)


class LogHandler(logging.Handler):
    def __init__(self, client, session_id):
        super().__init__()
        self.client = client
        self.session_id = session_id

    def emit(self, record):
        log_entry = self.format(record)

        if self.client.state == smpplib.consts.SMPP_CLIENT_STATE_BOUND_TRX:
            is_bound = True
        else:
            is_bound = False

        users[self.session_id]['is_bound'] = is_bound

        # log_entry = f"{self.session_id} - {log_entry}"

        users[self.session_id]['log_message_queue'].put(json.dumps({
            'logMessage': log_entry,
            'isBound': is_bound,
        }))
