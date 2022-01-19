from django.db import models
from .constants import FIELDS_CONSTRAINTS
import string
import random


def generate_unique_id_for_bind():
    length = 6
    while True:
        var_id = ''.join(random.choices(string.ascii_lowercase, k=length))

        if Bind.objects.filter(sessionId=var_id).count() == 0:
            break

    return var_id


def generate_unique_id_for_message():
    length = 6
    while True:
        var_id = ''.join(random.choices(string.ascii_lowercase, k=length))

        if Message.objects.filter(sessionId=var_id).count() == 0:
            break

    return var_id


class Bind(models.Model):
    sessionId = models.CharField(max_length=8, default=generate_unique_id_for_bind, unique=True)
    host = models.CharField(max_length=50, unique=True)
    systemId = models.CharField(max_length=FIELDS_CONSTRAINTS['max_system_id_length'])
    hostname = models.CharField(max_length=20)  # todo max_length?
    password = models.CharField(max_length=FIELDS_CONSTRAINTS['max_password_length'])
    port = models.IntegerField()
    systemType = models.CharField(max_length=FIELDS_CONSTRAINTS['max_system_type_length'])
    useSSL = models.BooleanField()
    addrTON = models.IntegerField()
    addrNPI = models.IntegerField()
    reconnect = models.BooleanField()


class Message(models.Model):
    sessionId = models.CharField(max_length=8, default=generate_unique_id_for_message, unique=True)
    host = models.CharField(max_length=50, unique=True)
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
