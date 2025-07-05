from django.urls import path
from .views import (
    ProcessListCreateView,
    MachineListCreateView,
    TrolleyListCreateView,
    UserListCreateView,
    LotListCreateView,
    LotDetailView,     # Make sure this is imported
    BatchListCreateView,
    BatchDetailView,
    AnalyticsView
)

urlpatterns = [
    path('processes/', ProcessListCreateView.as_view(), name='process-list'),
    path('machines/', MachineListCreateView.as_view(), name='machine-list'),
    path('trolleys/', TrolleyListCreateView.as_view(), name='trolley-list'),
    path('users/', UserListCreateView.as_view(), name='user-list'),
    path('lots/', LotListCreateView.as_view(), name='lot-list'),
    path('lots/<int:pk>/', LotDetailView.as_view(), name='lot-detail'), # This is the missing line
    path('batches/', BatchListCreateView.as_view(), name='batch-list'),
    path('batches/<int:pk>/', BatchDetailView.as_view(), name='batch-detail'),
    path('analytics/', AnalyticsView.as_view(), name='analytics'),
]