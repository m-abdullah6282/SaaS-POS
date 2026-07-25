from rest_framework import serializers
from django.core.validators import MinValueValidator
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    price = serializers.DecimalField(
        max_digits=10, decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    cost_price = serializers.DecimalField(
        max_digits=10, decimal_places=2,
        validators=[MinValueValidator(0)]
    )

    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'cost_price', 'stock', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']