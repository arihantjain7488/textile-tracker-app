from django.db import models

class Process(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Machine(models.Model):
    name = models.CharField(max_length=100, unique=True)
    process = models.ForeignKey(Process, on_delete=models.CASCADE, related_name='machines')

    def __str__(self):
        return self.name

class Trolley(models.Model):
    trolley_number = models.CharField(max_length=50, unique=True)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.trolley_number

class User(models.Model):
    ROLE_CHOICES = [
        ('OPERATOR', 'Operator'),
        ('SUPERVISOR', 'Supervisor'),
        ('PROCESS_HEAD', 'Process Head'),
        ('OWNER', 'Owner'),
    ]
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.name} ({self.get_role_display()})"
    
# --- Add this new code at the bottom of the file ---

class Lot(models.Model):
    lot_no = models.CharField(max_length=100, unique=True, help_text="Unique Lot number")
    party_name = models.CharField(max_length=200)
    initial_meters = models.DecimalField(max_digits=10, decimal_places=2)
    inward_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Lot {self.lot_no} - {self.party_name}"

class Batch(models.Model):
    STATUS_CHOICES = [
        ('AWAITING_PROCESS', 'Awaiting Process'),
        ('IN_PROCESS', 'In Process'),
        ('COMPLETED', 'Completed'),
        ('ON_HOLD', 'On Hold'),
    ]
    batch_no = models.CharField(max_length=100)
    lot = models.ForeignKey(Lot, on_delete=models.CASCADE, related_name='batches')
    current_process = models.ForeignKey(Process, on_delete=models.SET_NULL, null=True, blank=True)
    current_machine = models.ForeignKey(Machine, on_delete=models.SET_NULL, null=True, blank=True)
    current_trolley = models.ForeignKey(Trolley, on_delete=models.SET_NULL, null=True, blank=True)
    current_operator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    meters = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='AWAITING_PROCESS')
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        # Ensures that for a given lot, the batch number is unique.
        unique_together = ('lot', 'batch_no')
        verbose_name_plural = "Batches"

    def __str__(self):
        return f"{self.lot} - Batch {self.batch_no}"