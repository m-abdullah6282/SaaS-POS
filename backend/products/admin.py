from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'tenant', 'price', 'stock', 'is_active')
    list_filter = ('is_active', 'tenant')
    search_fields = ('name',)