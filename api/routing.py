from django.conf.urls import url

from .consumers import LogConsumer

websocket_urlpatterns = [
    url('ws/api/', LogConsumer.as_asgi()),
]
