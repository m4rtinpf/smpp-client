from rest_framework import serializers
from .models import ClientModel, MessageModel


class BindSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientModel
        fields = (
            'id',
            # 'host',
            'sessionId',
            'systemId',
            'hostname',
            'password',
            'port',
            'systemType',
            'useSSL',
            'addrTON',
            'addrNPI',
            'reconnect',
        )


class CreateBindingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientModel
        fields = (
            'systemId',
            'hostname',
            'password',
            'port',
            'systemType',
            'useSSL',
            'addrTON',
            'addrNPI',
            'reconnect',
        )


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageModel
        fields = (
            'id',
            # 'host',
            # 'sessionId',
            'client',
            'messageText',
            'sourceAddr',
            'sourceAddrTON',
            'sourceAddrNPI',
            'destAddr',
            'destAddrTON',
            'destAddrNPI',
            'serviceType',
            'bulkSubmitEnable',
            'bulkSubmitTimes',
            'dataCoding',
            'submitMode',
        )


class CreateMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageModel
        fields = (
            'messageText',
            'sourceAddr',
            'sourceAddrTON',
            'sourceAddrNPI',
            'destAddr',
            'destAddrTON',
            'destAddrNPI',
            'serviceType',
            'bulkSubmitEnable',
            'bulkSubmitTimes',
            'dataCoding',
            'submitMode',
        )
