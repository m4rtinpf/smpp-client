from django.shortcuts import render
from rest_framework import generics, status
from .serializers import BindSerializer, CreateBindingSerializer, MessageSerializer, CreateMessageSerializer
from .models import Bind, Message
from rest_framework.views import APIView
from rest_framework.response import Response

from .handle_smpp import MyThread


class BindView(generics.ListAPIView):
    queryset = Bind.objects.all()
    serializer_class = BindSerializer


class CreateBindingView(APIView):
    serializer_class = CreateBindingSerializer

    def post(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            system_id = serializer.data.get('systemId')
            hostname = serializer.data.get('hostname')
            password = serializer.data.get('password')
            port = serializer.data.get('port')
            system_type = serializer.data.get('systemType')
            use_ssl = serializer.data.get('useSSL')
            addr_ton = serializer.data.get('addrTON')
            addr_npi = serializer.data.get('addrTON')
            reconnect = serializer.data.get('reconnect')

            host = self.request.session.session_key

            queryset = Bind.objects.filter(host=host)
            if queryset.exists():
                bind = queryset[0]
                bind.systemId = system_id
                bind.hostname = hostname
                bind.password = password
                bind.port = port
                bind.systemType = system_type
                bind.useSSL = use_ssl
                bind.addrTON = addr_ton
                bind.addrNPI = addr_npi
                bind.reconnect = reconnect

                bind.save(update_fields=[
                    'systemId',
                    'hostname',
                    'password',
                    'port',
                    'systemType',
                    'useSSL',
                    'addrTON',
                    'addrNPI',
                    'reconnect',
                ])
                print(BindSerializer(bind).data)

                # Create a new thread
                thread = MyThread(
                    system_id=bind.systemId,
                    hostname=bind.hostname,
                    password=bind.password,
                    port=bind.port,
                    system_type=bind.systemType,
                    use_ssl=bind.useSSL,
                    addr_ton=bind.addrTON,
                    addr_npi=bind.addrNPI,
                    reconnect=bind.reconnect,
                    host=bind.host,
                )

                # Start the thread
                thread.start()
                # thread.join()

                print("Back to main thread")

                return Response({'isBound': True}, status=status.HTTP_200_OK)
            else:
                bind = Bind(
                    host=host,
                    systemId=system_id,
                    hostname=hostname,
                    password=password,
                    port=port,
                    systemType=system_type,
                    useSSL=use_ssl,
                    addrTON=addr_ton,
                    addrNPI=addr_npi,
                    reconnect=reconnect,
                )
                bind.save()

                print(BindSerializer(bind).data)

                return Response(BindSerializer(bind).data, status=status.HTTP_201_CREATED)

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

            host = self.request.session.session_key

            queryset = Message.objects.filter(host=host)
            if queryset.exists():
                message = queryset[0]
                message.messageText = message_text
                message.sourceAddr = source_addr
                message.sourceAddrTON = source_addr_ton
                message.sourceAddrNPI = source_addr_npi
                message.destAddr = dest_addr
                message.destAddrTON = dest_addr_ton
                message.destAddrNPI = dest_addr_npi
                message.serviceType = service_type
                message.bulkSubmitEnable = bulk_submit_enable
                message.bulkSubmitTimes = bulk_submit_times
                message.dataCoding = data_coding
                message.submitMode = submit_mode

                message.save(update_fields=[
                    'messageText',
                    'sourceAddr',
                    'sourceAddrTON',
                    'sourceAddrNPI',
                    'destAddr',
                    'destAddrTON',
                    'destAddrNPI',
                    'serviceType',
                    'bulkSubmitEnable',
                    'bulkSubmitTimes',
                    'dataCoding',
                    'submitMode',
                ])
                print(MessageSerializer(message).data)

                return Response(MessageSerializer(message).data, status=status.HTTP_200_OK)
            else:
                message = Message(
                    host=host,
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

                print(MessageSerializer(message).data)

                return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)

        return Response({"Bad Request": "Invalid data..."}, status=status.HTTP_400_BAD_REQUEST)
