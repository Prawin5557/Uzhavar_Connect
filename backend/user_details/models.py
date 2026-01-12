from django.db import models

class User(models.Model):
    ROLE_CHOICES = [
        ('Farmer', 'Farmer'),
        ('Buyer', 'Buyer'),
    ]

    name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    email = models.EmailField(unique=True)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    password = models.CharField(max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.email

class Product(models.Model):
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="products")
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    qty = models.PositiveIntegerField()
    image = models.TextField(blank=True, null=True)  # base64 image
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
