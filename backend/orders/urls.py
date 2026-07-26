from django.urls import path
from .views import OrderListCreateView, OrderDetailView
from .analytics_views import AnalyticsDashboardView

urlpatterns = [
    path('', OrderListCreateView.as_view(), name='order-list-create'),
    path('<uuid:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('analytics/dashboard/', AnalyticsDashboardView.as_view(), name='analytics-dashboard'),
]