from rest_framework import serializers
from django.db import transaction
from tenants.models import Tenant
from .models import User


class SignupSerializer(serializers.Serializer):
    # Owner (User) fields
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)

    # Store (Tenant) fields
    store_name = serializers.CharField(max_length=255)
    category = serializers.ChoiceField(choices=Tenant._meta.get_field('category').choices)

    def create(self, validated_data):
        with transaction.atomic():
            tenant = Tenant.objects.create(
                store_name=validated_data['store_name'],
                category=validated_data['category'],
            )
            user = User.objects.create_user(
                email=validated_data['email'],
                password=validated_data['password'],
                name=validated_data['name'],
                role='owner',
                tenant=tenant,
            )
        return user