from rest_framework import serializers
from .models import Bind, Message


class BindSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bind
        fields = (
            'id',
            'host',
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
        model = Bind
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
        model = Message
        fields = (
            'id',
            'host',
            'sessionId',
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
        model = Message
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
