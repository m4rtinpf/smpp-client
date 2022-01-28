import threading

from django.shortcuts import render
from rest_framework import generics, status
from .serializers import ClientResponseSerializer, ClientRequestSerializer, MessageSerializer, CreateMessageSerializer
from .models import ClientModel, MessageModel
from rest_framework.views import APIView
from rest_framework.response import Response
from .handle_smpp import TxThread


class BindView(generics.ListAPIView):
    queryset = ClientModel.objects.all()
    serializer_class = ClientResponseSerializer


class ClientView(APIView):
    request_serializer_class = ClientRequestSerializer

    @staticmethod
    def bind_client(client_instance):
        evt = threading.Event()

        # todo remove
        client_instance.isBound = False
        client_instance.save()

        tx_thread = TxThread(
            system_id=client_instance.systemId,
            hostname=client_instance.hostname,
            password=client_instance.password,
            port=client_instance.port,
            system_type=client_instance.systemType,
            use_ssl=client_instance.useSSL,
            reconnect=client_instance.reconnect,
            session_id=client_instance.sessionId,
            command='bind',
            event=evt,
        )

        tx_thread.start()

        # Wait for tx_thread to finish setting up the binding
        evt.wait()

    def post(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

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

            queryset = ClientModel.objects.filter(sessionId=session_id)
            if queryset.exists():
                client_instance = queryset[0]
                client_instance.systemId = system_id
                client_instance.hostname = hostname
                client_instance.password = password
                client_instance.port = port
                client_instance.systemType = system_type
                client_instance.useSSL = use_ssl
                client_instance.reconnect = reconnect

                client_instance.save(update_fields=[
                    'systemId',
                    'hostname',
                    'password',
                    'port',
                    'systemType',
                    'useSSL',
                    'reconnect',
                ])
                print(ClientResponseSerializer(client_instance).data)

                self.bind_client(client_instance)
                client_instance.refresh_from_db()

                print(f"Client is bound = {client_instance.isBound}")

                return Response({'isBound': client_instance.isBound}, status=status.HTTP_200_OK)
            else:
                client_instance = ClientModel(
                    sessionId=session_id,
                    systemId=system_id,
                    hostname=hostname,
                    password=password,
                    port=port,
                    systemType=system_type,
                    useSSL=use_ssl,
                    reconnect=reconnect,
                )
                client_instance.save()

                print(ClientResponseSerializer(client_instance).data)

                self.bind_client(client_instance)
                client_instance.refresh_from_db()

                print(f"Client is bound = {client_instance.isBound}")

                return Response({'isBound': client_instance.isBound}, status=status.HTTP_201_CREATED)

        return Response({"Bad Request": "Invalid data..."}, status=status.HTTP_400_BAD_REQUEST)


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

            # queryset = MessageModel.objects.filter(client=session_id)
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
                client=ClientModel.objects.filter(sessionId=session_id)[0],
                # todo check that the client_instance exists
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

            # print(MessageSerializer(message).data)

            return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)

        return Response({"Bad Request": "Invalid data..."}, status=status.HTTP_400_BAD_REQUEST)
