from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .models import UserModel


def get_group_name_from_user_id(user_id):
    return f'message-group-for-user-{user_id}'


class LogConsumer(WebsocketConsumer):
    def __init__(self):
        super().__init__()
        self.group_name = ''

    def connect(self):
        if self.scope['session'].exists(self.scope['session'].session_key):
            session_id = self.scope['session'].session_key
            queryset = UserModel.objects.filter(sessionId=session_id)
            if queryset.exists():
                user = queryset[0]
                self.group_name = get_group_name_from_user_id(user.id)
                print(self.group_name)
                self.accept()
                async_to_sync(self.channel_layer.group_add)(self.group_name, self.channel_name)

    def disconnect(self, code):
        if self.scope['session'].exists(self.scope['session'].session_key):
            async_to_sync(self.channel_layer.group_discard)(self.group_name, self.channel_name)

    def send_message(self, event):
        message = event['message']
        self.send(message)
