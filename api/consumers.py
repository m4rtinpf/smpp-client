from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .models import users


def get_group_name_from_session_id(session_id):
    return f'message-group-{session_id}'


class LogConsumer(WebsocketConsumer):
    def __init__(self):
        super().__init__()

    def connect(self):
        if self.scope['session'].exists(self.scope['session'].session_key):
            session_id = self.scope['session'].session_key
            if session_id in users:
                group_name = get_group_name_from_session_id(session_id)
                self.accept()
                async_to_sync(self.channel_layer.group_add)(group_name, self.channel_name)

    def disconnect(self, code):
        if self.scope['session'].exists(self.scope['session'].session_key):
            session_id = self.scope['session'].session_key
            group_name = get_group_name_from_session_id(session_id)

            if session_id in users:
                async_to_sync(self.channel_layer.group_discard)(group_name, self.channel_name)

    def send_message(self, event):
        if self.scope['session'].exists(self.scope['session'].session_key):
            session_id = self.scope['session'].session_key

            while not users[session_id]['log_message_queue'].empty():
                log_message = users[session_id]['log_message_queue'].get()
                self.send(log_message)
