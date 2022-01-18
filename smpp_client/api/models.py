from django.db import models
import string
import random

MIN_PORT = 1
MAX_PORT = 65535
MAX_SYSTEM_ID_LENGTH = 16
MAX_PASSWORD_LENGTH = 9
MAX_SYSTEM_TYPE_LENGTH = 13
MAX_ADDR_TON_LENGTH = 1
MAX_ADDR_NPI_LENGTH = 1


def generate_unique_id(model, length=6):
    while True:
        var_id = ''.join(random.choices(string.ascii_lowercase, k=length))

        if model.objects.filter(session_id=var_id).count() == 0:
            break

    return var_id


class Bind(models.Model):
    session_id = models.CharField(max_length=8, default="", unique=True)
    system_id = models.CharField(max_length=MAX_SYSTEM_ID_LENGTH)
    hostname = models.CharField(max_length=20)  # max_length?
    password = models.CharField(max_length=MAX_PASSWORD_LENGTH)
    port = models.IntegerField()
    system_type = models.CharField(max_length=MAX_SYSTEM_TYPE_LENGTH)
    use_ssl = models.BooleanField()
    addr_ton = models.IntegerField()
    addr_npi = models.IntegerField()
    reconnect = models.BooleanField()
