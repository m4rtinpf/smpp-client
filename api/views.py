import threading
from rest_framework import status
from .models import users
from rest_framework.views import APIView
from rest_framework.response import Response
from .handle_smpp import TxThread
from .utils import is_valid_bind_request, is_valid_message_request
from queue import Queue


class UserView(APIView):
    @staticmethod
    def bind_user(session_id):
        tx_thread = TxThread(session_id=session_id, command='bind')
        tx_thread.start()

    @staticmethod
    def unbind_user(session_id):
        pass

    def post(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        session_id = self.request.session.session_key

        print(f'Bind request: {request.data}')

        if is_valid_bind_request(request.data):
            command = self.request.data['command'].lower()

            if command == 'connect':
                if session_id in users and users[session_id]['is_bound']:
                    return Response({'error': 'trying to connect in the bound state'},
                                    status=status.HTTP_400_BAD_REQUEST)

                users[session_id] = {
                    'system_id': request.data.get('systemId'),
                    'hostname': request.data.get('hostname'),
                    'password': request.data.get('password'),
                    'port': request.data.get('port'),
                    'system_type': request.data.get('systemType'),
                    'use_ssl': request.data.get('useSSL'),
                    'reconnect': request.data.get('reconnect'),
                    'is_done': False,
                    'message_queue': Queue(),
                    'log_message_queue': Queue(),
                    'is_bound': True,
                }

                self.bind_user(session_id)

                return Response({}, status=status.HTTP_200_OK)

            elif command == 'disconnect':
                if session_id in users:
                    if not users[session_id]['is_bound']:
                        return Response({'error': 'trying to disconnect in the unbound state'},
                                        status=status.HTTP_400_BAD_REQUEST)

                    users[session_id]['is_done'] = True

                    self.unbind_user(session_id)

                    return Response({}, status=status.HTTP_200_OK)
                else:
                    return Response({'error': "user doesn't exist"}, status=status.HTTP_204_NO_CONTENT)

        return Response({}, status=status.HTTP_400_BAD_REQUEST)


class CreateMessageView(APIView):
    def post(self, request):
        print(f'Message request: {request.data}')

        if not self.request.session.exists(self.request.session.session_key):
            return Response({'error': 'no session id provided'}, status=status.HTTP_403_FORBIDDEN)
        else:
            session_id = self.request.session.session_key

            if session_id not in users:
                return Response({'error': "user doesn't exist"}, status=status.HTTP_204_NO_CONTENT)
            else:
                message = is_valid_message_request(request.data)
                if message:
                    if not users[session_id]['is_bound']:
                        return Response({'error': 'trying to send a message in the unbound state'},
                                        status=status.HTTP_400_BAD_REQUEST)

                    user = users[session_id]

                    if message['bulk_submit_enable']:
                        for i in range(message['bulk_submit_times']):
                            user['message_queue'].put(message)
                    else:
                        user['message_queue'].put(message)

                    return Response({}, status=status.HTTP_201_CREATED)

        return Response({}, status=status.HTTP_400_BAD_REQUEST)
