from django.urls import path
from .views import BindView, CreateBindingView, CreateMessageView

urlpatterns = [
    path('list-bindings', BindView.as_view()),
    path('bind', CreateBindingView.as_view()),
    path('message', CreateMessageView.as_view()),
]
