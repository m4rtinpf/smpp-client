import socket


def is_valid_hostname(hostname):
    hostname = str(hostname)
    socket.gethostbyname(hostname)
    return hostname


BIND_FIELDS = {
    'connect': {
        'systemId': {
            'type': str,
            'min_length': 1,
            'max_length': 16,
        },
        'hostname': {
            'type': is_valid_hostname,
            'min_length': 1,
        },
        'password': {
            'type': str,
            'min_length': 1,
            'max_length': 9,
        },
        'port': {
            'type': int,
            'min_value': 1,
            'max_value': 65535,
            'default': 2775,
        },
        'systemType': {
            'type': str,
            'min_length': 1,
            'max_length': 13,
        },
        'useSSL': {
            'type': bool,
            'default': False,
        },
        'reconnect': {
            'type': bool,
            'default': False,
        },
    },
    'disconnect': dict(),
}


def is_valid_bind_request(request_data):
    if 'command' in request_data and request_data['command'] in BIND_FIELDS:
        command = request_data['command']
        for k, v in BIND_FIELDS[command].items():
            if k in request_data:
                try:
                    request_data[k] = v['type'](request_data[k])
                except Exception:
                    return False

                if 'max_length' in v and len(request_data[k]) > v['max_length']:
                    return False

                if 'min_value' in v and request_data[k] < v['min_value']:
                    return False

                if 'max_value' in v and request_data[k] > v['max_value']:
                    return False

            else:
                if 'min_length' in v:
                    return False

                request_data[k] = v['default']

        return request_data

    return False


def is_valid_message_request(request_data):
    return {
        'message_text': request_data['messageText'],
        'source_addr': request_data['sourceAddr'],
        'source_addr_ton': int(request_data['sourceAddrTON']),
        'source_addr_npi': int(request_data['sourceAddrNPI']),
        'dest_addr': request_data['destAddr'],
        'dest_addr_ton': int(request_data['destAddrTON']),
        'dest_addr_npi': int(request_data['destAddrNPI']),
        'service_type': int(request_data['serviceType']),
        'bulk_submit_enable': request_data['bulkSubmitEnable'],
        'bulk_submit_times': int(request_data['bulkSubmitTimes']),
        'data_coding': int(request_data['dataCoding']),
        'submit_mode': request_data['submitMode'],
    }
