from rest_framework import serializers
from django.db import transaction
from .models import Order, OrderItem
from products.models import Product


class OrderItemReadSerializer(serializers.ModelSerializer):
    product_name = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price_at_sale']

    def get_product_name(self, obj):
        return obj.product.name if obj.product else 'Deleted Product'


class OrderReadSerializer(serializers.ModelSerializer):
    items = OrderItemReadSerializer(many=True, read_only=True)
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'tenant', 'created_by', 'created_by_name', 'total_amount', 'created_at', 'items']

    def get_created_by_name(self, obj):
        return obj.created_by.name if obj.created_by else None


class OrderItemInputSerializer(serializers.Serializer):
    product_id = serializers.UUIDField()
    quantity = serializers.IntegerField(min_value=1)


class OrderCreateSerializer(serializers.Serializer):
    items = OrderItemInputSerializer(many=True)

    def create(self, validated_data):
        request = self.context['request']
        tenant = request.user.tenant
        items_data = validated_data['items']

        with transaction.atomic():
            order = Order.objects.create(tenant=tenant, created_by=request.user, total_amount=0)
            total = 0

            for item in items_data:
                try:
                    product = Product.objects.get(id=item['product_id'], tenant=tenant)
                except Product.DoesNotExist:
                    raise serializers.ValidationError(
                        f"Product with id '{item['product_id']}' does not exist or does not belong to your store."
                    )

                if product.stock < item['quantity']:
                    raise serializers.ValidationError(
                        f"Insufficient stock for {product.name}. Available: {product.stock}"
                    )

                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=item['quantity'],
                    price_at_sale=product.price,
                )

                product.stock -= item['quantity']
                product.save()

                total += product.price * item['quantity']

            order.total_amount = total
            order.save()

        return order