from rest_framework import serializers
from .models import Bind


class BindSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bind
        fields = (
            'id',
            'session_id',
            'hostname',
            'password',
            'port',
            'system_type',
            'use_ssl',
            'addr_ton',
            'addr_npi',
            'reconnect',
        )
