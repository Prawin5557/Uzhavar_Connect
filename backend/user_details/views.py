from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password
from .models import User, Product


@api_view(['POST'])
def signup(request):
    data = request.data

    if not data.get("email") or not data.get("password") or not data.get("role"):
        return Response({"message": "Missing required fields"}, status=400)

    if User.objects.filter(email=data.get("email")).exists():
        return Response({"message": "Email already exists"}, status=400)

    if not data.get("dob"):
        return Response({"message": "Date of birth required"}, status=400)

    user = User.objects.create(
        name=data.get("name"),
        date_of_birth=data.get("dob"),
        email=data.get("email"),
        address=data.get("address"),
        phone=data.get("phone"),
        role=data.get("role").capitalize(),
        password=make_password(data.get("password")),
    )

    return Response({
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role.lower()
        }
    }, status=201)


@api_view(['POST'])
def login(request):
    data = request.data

    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not email or not password or not role:
        return Response({"message": "Missing credentials"}, status=400)

    try:
        user = User.objects.get(email=email, role=role.capitalize())

        if not check_password(password, user.password):
            return Response({"message": "Invalid password"}, status=401)

        return Response({
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role.lower()
            }
        })

    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=404)


@api_view(['GET'])
def list_products(request):
    products = Product.objects.all().order_by('-created_at')
    return Response([
        {
            "id": p.id,
            "name": p.name,
            "price": float(p.price),
            "qty": p.qty,
            "image": p.image,
            "farmer_id": p.farmer_id,
        } for p in products
    ])


@api_view(['POST'])
def add_product(request):
    data = request.data
    farmer_id = data.get("farmer_id")

    if not farmer_id:
        return Response({"message": "farmer_id required"}, status=400)

    product = Product.objects.create(
        farmer_id=farmer_id,
        name=data.get("name"),
        price=data.get("price"),
        qty=data.get("qty"),
        image=data.get("image"),
    )

    return Response({"id": product.id}, status=201)


@api_view(['PUT'])
def update_product(request, pk):
    data = request.data
    try:
        product = Product.objects.get(pk=pk)
        product.name = data.get("name")
        product.price = data.get("price")
        product.qty = data.get("qty")
        product.image = data.get("image")
        product.save()
        return Response({"message": "Updated"})
    except Product.DoesNotExist:
        return Response({"message": "Not found"}, status=404)


@api_view(['DELETE'])
def delete_product(request, pk):
    try:
        Product.objects.get(pk=pk).delete()
        return Response({"message": "Deleted"})
    except Product.DoesNotExist:
        return Response({"message": "Not found"}, status=404)
