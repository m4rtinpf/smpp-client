from django.urls import path
from .views import UserView, CreateMessageView

urlpatterns = [
    path('bind', UserView.as_view()),
    path('message', CreateMessageView.as_view()),
]
