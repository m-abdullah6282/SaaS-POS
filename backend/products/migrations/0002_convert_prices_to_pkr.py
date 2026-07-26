from decimal import Decimal

from django.db import migrations, models


USD_TO_PKR_RATE = Decimal('277.8714')


def convert_prices_to_pkr(apps, schema_editor):
    Product = apps.get_model('products', 'Product')

    for product in Product.objects.all().iterator():
        product.price = (product.price * USD_TO_PKR_RATE).quantize(Decimal('0.01'))
        product.cost_price = (product.cost_price * USD_TO_PKR_RATE).quantize(Decimal('0.01'))
        product.save(update_fields=['price', 'cost_price'])


class Migration(migrations.Migration):
    dependencies = [
        ('products', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='price',
            field=models.DecimalField(decimal_places=2, max_digits=12),
        ),
        migrations.AlterField(
            model_name='product',
            name='cost_price',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
        ),
        migrations.RunPython(convert_prices_to_pkr, migrations.RunPython.noop),
    ]
