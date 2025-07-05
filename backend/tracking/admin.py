from django.contrib import admin
from .models import Process, Machine, Trolley, User, Lot, Batch # Add Lot and Batch here

# Register your models here.
admin.site.register(Process)
admin.site.register(Machine)
admin.site.register(Trolley)
admin.site.register(User)
admin.site.register(Lot)     # Add this line
admin.site.register(Batch)   # Add this line