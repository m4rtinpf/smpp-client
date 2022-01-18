from django.urls import path
from .views import BindView

urlpatterns = [
    path('bind', BindView.as_view()),
]
