from rest_framework import serializers
from .models import UserModel, MessageModel


class UserResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = (
            'id',
            'sessionId',
            'systemId',
            'hostname',
            'password',
            'port',
            'systemType',
            'useSSL',
            'reconnect',
            'isDone',
            'isBound',
        )


class UserRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = (
            'systemId',
            'hostname',
            'password',
            'port',
            'systemType',
            'useSSL',
            'reconnect',
        )


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageModel
        fields = (
            'id',
            # 'host',
            # 'sessionId',
            'user',
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
