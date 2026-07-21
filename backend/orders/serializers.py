from rest_framework import serializers
from django.db import transaction
from .models import Order, OrderItem
from products.models import Product


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
                product = Product.objects.get(id=item['product_id'], tenant=tenant)

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