def is_valid_bind_request(request):
    # request_type=request['command'].lower()
    return True


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
