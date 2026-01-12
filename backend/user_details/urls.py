from django.urls import path
from .views import (
    signup, login,
    list_products, add_product, update_product, delete_product
)

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),

    # Product APIs
    path('products/', list_products, name='list_products'),
    path('products/add/', add_product, name='add_product'),
    path('products/<int:pk>/', update_product, name='update_product'),
    path('products/<int:pk>/delete/', delete_product, name='delete_product'),
]
