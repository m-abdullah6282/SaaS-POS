from decimal import Decimal

from django.db import migrations, models


USD_TO_PKR_RATE = Decimal('277.8714')


def convert_amounts_to_pkr(apps, schema_editor):
    Order = apps.get_model('orders', 'Order')
    OrderItem = apps.get_model('orders', 'OrderItem')

    for item in OrderItem.objects.all().iterator():
        item.price_at_sale = (item.price_at_sale * USD_TO_PKR_RATE).quantize(Decimal('0.01'))
        item.save(update_fields=['price_at_sale'])

    for order in Order.objects.all().iterator():
        order.total_amount = (order.total_amount * USD_TO_PKR_RATE).quantize(Decimal('0.01'))
        order.save(update_fields=['total_amount'])


class Migration(migrations.Migration):
    dependencies = [
        ('orders', '0001_initial'),
        ('products', '0002_convert_prices_to_pkr'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='total_amount',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
        ),
        migrations.AlterField(
            model_name='orderitem',
            name='price_at_sale',
            field=models.DecimalField(decimal_places=2, max_digits=12),
        ),
        migrations.RunPython(convert_amounts_to_pkr, migrations.RunPython.noop),
    ]
