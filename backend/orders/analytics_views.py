from datetime import timedelta
from decimal import Decimal

from django.db.models import Count, Sum
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from products.models import Product

from .models import Order, OrderItem


RANGE_DAYS = {
    'today': 1,
    '7days': 7,
    '30days': 30,
}


class AnalyticsDashboardView(APIView):
    """Return tenant-scoped dashboard analytics for a requested date range."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        selected_range = request.query_params.get('range', 'today')
        if selected_range not in RANGE_DAYS:
            return Response(
                {'detail': 'Invalid range. Use one of: today, 7days, 30days.'},
                status=400,
            )

        tenant = request.user.tenant
        days = RANGE_DAYS[selected_range]
        date_to = timezone.localdate()
        date_from = date_to - timedelta(days=days - 1)
        previous_to = date_from - timedelta(days=1)
        previous_from = previous_to - timedelta(days=days - 1)

        current_orders = Order.objects.filter(
            tenant=tenant,
            created_at__date__range=(date_from, date_to),
        )
        previous_orders = Order.objects.filter(
            tenant=tenant,
            created_at__date__range=(previous_from, previous_to),
        )
        current_items = OrderItem.objects.filter(order__in=current_orders)

        summary = self._summary(current_orders, current_items)
        previous_summary = self._summary(
            previous_orders,
            OrderItem.objects.filter(order__in=previous_orders),
        )

        product_comparison = (
            current_items
            .values('product__id', 'product__name')
            .annotate(units_sold=Sum('quantity'))
            .order_by('-units_sold', 'product__name')[:8]
        )
        low_stock_products = (
            Product.objects.filter(tenant=tenant, is_active=True, stock__lt=10)
            .order_by('stock', 'name')
            .values('id', 'name', 'stock', 'price')
        )

        return Response({
            'range': selected_range,
            'date_from': str(date_from),
            'date_to': str(date_to),
            'summary': {
                **summary,
                'revenue_change_percent': self._percent_change(
                    summary['total_revenue'], previous_summary['total_revenue']
                ),
                'orders_change_percent': self._percent_change(
                    summary['total_orders'], previous_summary['total_orders']
                ),
                'units_change_percent': self._percent_change(
                    summary['units_sold'], previous_summary['units_sold']
                ),
            },
            'top_products': self._serialize_products(product_comparison[:5]),
            'product_comparison': self._serialize_products(product_comparison),
            'low_stock_products': [
                {
                    'product_id': str(product['id']),
                    'product_name': product['name'],
                    'stock': product['stock'],
                    'price': str(product['price']),
                }
                for product in low_stock_products
            ],
        })

    @staticmethod
    def _summary(orders, items):
        totals = orders.aggregate(
            total_revenue=Sum('total_amount'),
            total_orders=Count('id'),
        )
        units_sold = items.aggregate(units_sold=Sum('quantity'))['units_sold'] or 0
        total_revenue = totals['total_revenue'] or Decimal('0')
        total_orders = totals['total_orders'] or 0

        return {
            'total_revenue': str(total_revenue),
            'total_orders': total_orders,
            'units_sold': units_sold,
            'average_order_value': str(total_revenue / total_orders) if total_orders else '0',
        }

    @staticmethod
    def _percent_change(current, previous):
        current = Decimal(str(current))
        previous = Decimal(str(previous))
        if previous == 0:
            return 0 if current == 0 else 100
        return float(((current - previous) / previous * 100).quantize(Decimal('0.1')))

    @staticmethod
    def _serialize_products(queryset):
        return [
            {
                'product_id': str(row['product__id']) if row['product__id'] else None,
                'product_name': row['product__name'] or 'Deleted Product',
                'units_sold': row['units_sold'] or 0,
            }
            for row in queryset
        ]
