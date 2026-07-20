import uuid
from django.db import models


class Tenant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    store_name = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=[
        ('grocery', 'Grocery'),
        ('mobile_shop', 'Mobile Shop'),
        ('clothing', 'Clothing'),
        ('pharmacy', 'Pharmacy'),
    ])
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.store_name