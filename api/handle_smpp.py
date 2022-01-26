import threading
import logging
import sys

import smpplib.gsm
import smpplib.client
import smpplib.consts


class MyThread(threading.Thread):
    def __init__(self, system_id, hostname, password, port, system_type, use_ssl, addr_ton, addr_npi, reconnect, host):
        threading.Thread.__init__(self)
        self.system_id = system_id
        self.hostname = hostname
        self.password = password
        self.port = port
        self.system_type = system_type
        self.use_ssl = use_ssl
        self.addr_ton = addr_ton
        self.addr_npi = addr_npi
        self.reconnect = reconnect
        self.host = host

    def run(self):
        print(f"Starting thread for host {self.host} \n")
        # if you want to know what's happening
        logging.basicConfig(level='DEBUG')

        client = smpplib.client.Client(
            host=self.hostname,
            port=self.port,
            allow_unknown_opt_params=True,
        )

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

        print(f"Client state: {client.state}")

        if client.state == smpplib.consts.SMPP_CLIENT_STATE_BOUND_TRX:
            # todo better way? maybe using resp
            print('Client bound as transceiver')

        client.listen()

        print(f"Exiting thread for host {self.host} \n")
