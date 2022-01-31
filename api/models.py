from django.db import models
from .consts import FIELDS_CONSTRAINTS


class UserModel(models.Model):
    sessionId = models.CharField(max_length=50, unique=True)
    systemId = models.CharField(max_length=FIELDS_CONSTRAINTS['max_system_id_length'])
    hostname = models.CharField(max_length=253)
    password = models.CharField(max_length=FIELDS_CONSTRAINTS['max_password_length'])
    port = models.IntegerField()
    systemType = models.CharField(max_length=FIELDS_CONSTRAINTS['max_system_type_length'])
    useSSL = models.BooleanField()
    reconnect = models.BooleanField()
    isDone = models.BooleanField(blank=False, default=False)


class MessageModel(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    messageText = models.CharField(max_length=FIELDS_CONSTRAINTS['max_message_text_length'])
    sourceAddr = models.CharField(max_length=FIELDS_CONSTRAINTS['max_address_length'])
    sourceAddrTON = models.IntegerField()
    sourceAddrNPI = models.IntegerField()
    destAddr = models.CharField(max_length=FIELDS_CONSTRAINTS['max_address_length'])
    destAddrTON = models.IntegerField()
    destAddrNPI = models.IntegerField()
    serviceType = models.CharField(max_length=FIELDS_CONSTRAINTS['max_service_type_length'])
    bulkSubmitEnable = models.BooleanField()
    bulkSubmitTimes = models.IntegerField()
    dataCoding = models.IntegerField()
    submitMode = models.CharField(max_length=20)  # todo max_length?
    readyToBeSent = models.BooleanField(blank=False, default=False)
