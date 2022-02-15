import socket
import phonenumbers
import inflection
from typing import Union


def is_valid_hostname(hostname: str) -> str:
    """
    Check if `hostname` is valid.

    :param hostname:
    :return:
    """
    hostname = str(hostname)
    socket.gethostbyname(hostname)
    return hostname


def is_valid_phone_number(phone_number_string: str) -> Union[str, bool]:
    """
    Check if `phone_number_string` is valid.
    Assumes that it's an international number, returns it in E164 format.

    :param phone_number_string:
    :return:
    """
    phone_number_string = str(phone_number_string)
    if not phone_number_string.startswith('+'):
        phone_number_string = '+' + phone_number_string
    phone_number = phonenumbers.parse(phone_number_string, None)
    if not phonenumbers.is_valid_number(phone_number):
        return False
    return phonenumbers.format_number(phone_number, phonenumbers.PhoneNumberFormat.E164)


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

MESSAGE_FIELDS = {
    'messageText': {
        'type': str,
        'min_length': 1,
        'max_length': 160,
    },
    'sourceAddr': {
        'type': is_valid_phone_number,
        'min_length': 1,
        'max_length': 15,
    },
    'sourceAddrTON': {
        'type': int,
        'min_value': 0,
        'max_value': 9,
        'default': 0,
    },
    'sourceAddrNPI': {
        'type': int,
        'min_value': 0,
        'max_value': 9,
        'default': 0,
    },
    'serviceType': {
        'type': str,
        'max_length': 6,
        'default': 0,
    },
    'bulkSubmitEnable': {
        'type': bool,
        'default': False,
    },
    'bulkSubmitTimes': {
        'type': int,
        'min_value': 0,
        'max_value': 50,
        'default': 0,
    },
    'dataCoding': {
        'type': int,
        'min_value': 0,
        'max_value': 8,
        'default': 0,
    },
    'submitMode': {
        'type': str,
        'default': 'shortMessage',
    },
}
MESSAGE_FIELDS['destAddr'] = MESSAGE_FIELDS['sourceAddr']
MESSAGE_FIELDS['destAddrTON'] = MESSAGE_FIELDS['sourceAddrTON']
MESSAGE_FIELDS['destAddrNPI'] = MESSAGE_FIELDS['sourceAddrNPI']


def is_valid_bind_request(request_data: dict) -> Union[dict, bool]:
    """
    Check is a bind request is valid.

    :param request_data:
    :return:
    """
    if 'command' in request_data and request_data['command'] in BIND_FIELDS:
        command = request_data['command']

        formatted_request_data = {'command': command}
        for k, v in BIND_FIELDS[command].items():
            if k in request_data:
                try:
                    field = v['type'](request_data[k])
                except Exception:
                    return False

                if 'min_length' in v and len(field) < v['min_length']:
                    return False

                if 'max_length' in v and len(field) > v['max_length']:
                    return False

                if 'min_value' in v and field < v['min_value']:
                    return False

                if 'max_value' in v and field > v['max_value']:
                    return False

            else:
                if 'min_length' in v:
                    return False

                field = v['default']

            formatted_request_data.update({inflection.underscore(k): field})

        return formatted_request_data

    return False


def is_valid_message_request(request_data: dict) -> Union[dict, bool]:
    """
    Check if a message request is valid.

    :param request_data:
    :return:
    """
    formatted_request_data = dict()

    for k, v in MESSAGE_FIELDS.items():
        if k in request_data:
            try:
                field = v['type'](request_data[k])
            except Exception:
                return False

            if 'min_length' in v and len(field) < v['min_length']:
                return False

            if 'max_length' in v and len(field) > v['max_length']:
                return False

            if 'min_value' in v and field < v['min_value']:
                return False

            if 'max_value' in v and field > v['max_value']:
                return False

        else:
            if 'min_length' in v:
                return False

            field = v['default']

        formatted_request_data.update({inflection.underscore(k): field})

    if formatted_request_data['bulk_submit_enable'] and formatted_request_data['bulk_submit_times'] == 0:
        return False

    if formatted_request_data['data_coding'] not in [0, 3, 8]:
        return False

    if formatted_request_data['submit_mode'] != 'shortMessage':
        return False

    return formatted_request_data
