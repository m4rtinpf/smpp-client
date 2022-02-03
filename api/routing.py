from django.urls import re_path
from django.conf.urls import url

from . import consumers

websocket_urlpatterns = [
    url('ws/api/', consumers.LogConsumer.as_asgi()),
]
