from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import json


class LogConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        async_to_sync(self.channel_layer.group_add)('message_group', self.channel_name)

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)('message_group', self.channel_name)

    def send_message(self, event):
        message = event['message']
        self.send(message)
