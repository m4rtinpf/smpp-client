from django.urls import path
from .views import BindView, UserView, CreateMessageView

urlpatterns = [
    path('list-bindings', BindView.as_view()),
    path('bind', UserView.as_view()),
    path('message', CreateMessageView.as_view()),
]
