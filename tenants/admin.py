from django.contrib import admin
from .models import Tenant

@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ('store_name', 'category', 'is_active', 'created_at')
    list_filter = ('category', 'is_active')
    search_fields = ('store_name',)