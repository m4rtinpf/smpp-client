from django.shortcuts import render
from rest_framework import generics
from .serializers import BindSerializer
from .models import Bind


class BindView(generics.ListAPIView):
    queryset = Bind.objects.all()
    serializer_class = BindSerializer
