from django.urls import path
from .views import BindView, ClientView, CreateMessageView

urlpatterns = [
    path('list-bindings', BindView.as_view()),
    path('bind', ClientView.as_view()),
    path('message', CreateMessageView.as_view()),
]
