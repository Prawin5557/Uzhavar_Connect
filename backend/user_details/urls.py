from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),

    # Product APIs
    path('products/', views.list_products, name='list_products'),
    path('products/add/', views.add_product, name='add_product'),
    path('products/<int:pk>/', views.update_product, name='update_product'),
    path('products/<int:pk>/delete/', views.delete_product, name='delete_product'),

    # Orders
    path('orders/', views.orders, name='orders'),
    path('orders/<int:pk>/cancel/', views.cancel_order, name='cancel_order'),

    # Farmer reports
    path('farmer/<int:farmer_id>/sales/', views.farmer_sales_report, name='farmer_sales_report'),
]
