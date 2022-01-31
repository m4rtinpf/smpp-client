import threading

from django.shortcuts import render
from rest_framework import generics, status
from .serializers import UserResponseSerializer, UserRequestSerializer, MessageSerializer, CreateMessageSerializer
from .models import UserModel, MessageModel
from rest_framework.views import APIView
from rest_framework.response import Response
from .handle_smpp import TxThread


class BindView(generics.ListAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserResponseSerializer


class UserView(APIView):
    request_serializer_class = UserRequestSerializer

    @staticmethod
    def bind_user(user):
        evt = threading.Event()

        tx_thread = TxThread(
            system_id=user.systemId,
            hostname=user.hostname,
            password=user.password,
            port=user.port,
            system_type=user.systemType,
            use_ssl=user.useSSL,
            reconnect=user.reconnect,
            session_id=user.sessionId,
            command='bind',
            event=evt,
        )

        tx_thread.start()

        # Wait for tx_thread to finish setting up the binding
        evt.wait()

    @staticmethod
    def unbind_user(user):
        user.isDone = True
        user.save()

    def post(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        print(f'user request: {request.data}')

        request_serializer = self.request_serializer_class(data=request.data)
        if request_serializer.is_valid():
            system_id = request_serializer.data.get('systemId')
            hostname = request_serializer.data.get('hostname')
            password = request_serializer.data.get('password')
            port = request_serializer.data.get('port')
            system_type = request_serializer.data.get('systemType')
            use_ssl = request_serializer.data.get('useSSL')
            reconnect = request_serializer.data.get('reconnect')

            session_id = self.request.session.session_key

            command = self.request.data['command'].lower()

            queryset = UserModel.objects.filter(sessionId=session_id)
            if queryset.exists():
                user = queryset[0]
                user.systemId = system_id
                user.hostname = hostname
                user.password = password
                user.port = port
                user.systemType = system_type
                user.useSSL = use_ssl
                user.reconnect = reconnect

                user.isDone = False

                user.save(update_fields=[
                    'systemId',
                    'hostname',
                    'password',
                    'port',
                    'systemType',
                    'useSSL',
                    'reconnect',
                    'isDone',
                ])
                print(UserResponseSerializer(user).data)

                if command == 'connect':
                    self.bind_user(user)
                    user.refresh_from_db()  # todo remove?

                    return Response({}, status=status.HTTP_200_OK)
                elif command == 'disconnect':
                    self.unbind_user(user)
                    user.refresh_from_db()  # todo remove?

                    return Response({'data': 'unbind'}, status=status.HTTP_200_OK)

            else:
                user = UserModel(
                    sessionId=session_id,
                    systemId=system_id,
                    hostname=hostname,
                    password=password,
                    port=port,
                    systemType=system_type,
                    useSSL=use_ssl,
                    reconnect=reconnect,
                )
                user.save()

                print(UserResponseSerializer(user).data)

                self.bind_user(user)
                user.refresh_from_db()  # todo remove?

                return Response({}, status=status.HTTP_201_CREATED)

        return Response({}, status=status.HTTP_400_BAD_REQUEST)


class CreateMessageView(APIView):
    serializer_class = CreateMessageSerializer

    def post(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            message_text = serializer.data.get('messageText')
            source_addr = serializer.data.get('sourceAddr')
            source_addr_ton = serializer.data.get('sourceAddrTON')
            source_addr_npi = serializer.data.get('sourceAddrNPI')
            dest_addr = serializer.data.get('destAddr')
            dest_addr_ton = serializer.data.get('destAddrTON')
            dest_addr_npi = serializer.data.get('destAddrNPI')
            service_type = serializer.data.get('serviceType')
            bulk_submit_enable = serializer.data.get('bulkSubmitEnable')
            bulk_submit_times = serializer.data.get('bulkSubmitTimes')
            data_coding = serializer.data.get('dataCoding')
            submit_mode = serializer.data.get('submitMode')

            session_id = self.request.session.session_key

            # queryset = MessageModel.objects.filter(user=session_id)
            # if queryset.exists():
            #     message = queryset[0]
            #     message.messageText = message_text
            #     message.sourceAddr = source_addr
            #     message.sourceAddrTON = source_addr_ton
            #     message.sourceAddrNPI = source_addr_npi
            #     message.destAddr = dest_addr
            #     message.destAddrTON = dest_addr_ton
            #     message.destAddrNPI = dest_addr_npi
            #     message.serviceType = service_type
            #     message.bulkSubmitEnable = bulk_submit_enable
            #     message.bulkSubmitTimes = bulk_submit_times
            #     message.dataCoding = data_coding
            #     message.submitMode = submit_mode
            #
            #     message.save(update_fields=[
            #         'messageText',
            #         'sourceAddr',
            #         'sourceAddrTON',
            #         'sourceAddrNPI',
            #         'destAddr',
            #         'destAddrTON',
            #         'destAddrNPI',
            #         'serviceType',
            #         'bulkSubmitEnable',
            #         'bulkSubmitTimes',
            #         'dataCoding',
            #         'submitMode',
            #     ])
            #     print(MessageSerializer(message).data)
            #
            #     return Response(MessageSerializer(message).data, status=status.HTTP_200_OK)
            # else:
            message = MessageModel(
                user=UserModel.objects.filter(sessionId=session_id)[0],
                # todo check that the user exists
                messageText=message_text,
                sourceAddr=source_addr,
                sourceAddrTON=source_addr_ton,
                sourceAddrNPI=source_addr_npi,
                destAddr=dest_addr,
                destAddrTON=dest_addr_ton,
                destAddrNPI=dest_addr_npi,
                serviceType=service_type,
                bulkSubmitEnable=bulk_submit_enable,
                bulkSubmitTimes=bulk_submit_times,
                dataCoding=data_coding,
                submitMode=submit_mode,
            )
            message.save()

            queryset = UserModel.objects.filter(sessionId=session_id)
            if queryset.exists():
                user = queryset[0]
                user.isDone = False
                user.save()

            # print(MessageSerializer(message).data)

            return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)

        return Response({}, status=status.HTTP_400_BAD_REQUEST)
