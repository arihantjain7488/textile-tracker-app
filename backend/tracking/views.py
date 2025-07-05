from django.db.models import Count, Sum
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from .models import Process, Machine, Trolley, User, Lot, Batch
from .serializers import (
    ProcessSerializer,
    MachineSerializer,
    TrolleySerializer,
    UserSerializer,
    LotSerializer,
    BatchSerializer,
    BatchCreateSerializer,
    BatchUpdateSerializer
)

class ProcessListCreateView(generics.ListCreateAPIView):
    queryset = Process.objects.all()
    serializer_class = ProcessSerializer

class MachineListCreateView(generics.ListCreateAPIView):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer

class TrolleyListCreateView(generics.ListCreateAPIView):
    queryset = Trolley.objects.all()
    serializer_class = TrolleySerializer

class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class LotListCreateView(generics.ListCreateAPIView):
    queryset = Lot.objects.all()
    serializer_class = LotSerializer

# This is the class you were missing
class LotDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Lot.objects.all()
    serializer_class = LotSerializer

class BatchListCreateView(generics.ListCreateAPIView):
    queryset = Batch.objects.all()
    serializer_class = BatchSerializer

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return BatchCreateSerializer
        return BatchSerializer

class BatchDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Batch.objects.all()
    serializer_class = BatchSerializer

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return BatchUpdateSerializer
        return super().get_serializer_class()

class AnalyticsView(APIView):
    def get(self, request, format=None):
        # Count batches by status
        status_counts = Batch.objects.values('status').annotate(count=Count('id'))

        # Sum meters per operator for completed batches
        operator_performance = Batch.objects.filter(status='COMPLETED').values('current_operator__name').annotate(total_meters=Sum('meters'))

        data = {
            'status_counts': list(status_counts),
            'operator_performance': list(operator_performance)
        }
        return Response(data)
    
    