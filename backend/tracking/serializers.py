from rest_framework import serializers
from .models import Process, Machine, Trolley, User, Lot, Batch

# No changes to Process, Machine, Trolley, User serializers

class ProcessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Process
        fields = ['id', 'name']

class MachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = ['id', 'name', 'process']

class TrolleySerializer(serializers.ModelSerializer):
    class Meta:
        model = Trolley
        fields = ['id', 'trolley_number', 'is_available']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'role']

# This serializer is for READING batch data
class BatchSerializer(serializers.ModelSerializer):
    lot = serializers.StringRelatedField()
    current_process = serializers.StringRelatedField()
    current_machine = serializers.StringRelatedField()
    current_trolley = serializers.StringRelatedField()
    current_operator = serializers.StringRelatedField()

    class Meta:
        model = Batch
        fields = [
            'id', 'batch_no', 'lot', 'current_process', 'current_machine',
            'current_trolley', 'current_operator', 'meters', 'status', 'last_updated'
        ]

# This new serializer is for CREATING a batch
class BatchCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Batch
        fields = ['lot', 'batch_no', 'meters']


# Update LotSerializer to include the batches
class LotSerializer(serializers.ModelSerializer):
    batches = BatchSerializer(many=True, read_only=True)

    class Meta:
        model = Lot
        fields = ['id', 'lot_no', 'party_name', 'initial_meters', 'inward_date', 'batches']

class BatchUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Batch
        # These are the fields we will allow to be updated
        fields = ['status', 'current_process', 'current_machine', 'current_operator']