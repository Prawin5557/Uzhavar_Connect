from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password
from django.db.models import Sum, F
from .models import User, Product, Order, OrderItem


# ---------------- AUTH ----------------

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
        user = User.objects.get(email=email, role=role.capitalize().strip())
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


# ---------------- PRODUCTS ----------------

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
        farmer_id=int(farmer_id),
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


# ---------------- ORDERS ----------------

@api_view(["GET", "POST"])
def orders(request):
    # GET buyer orders
    if request.method == "GET":
        buyer_id = request.GET.get("buyer")
        if not buyer_id:
            return Response([], status=200)

        orders = Order.objects.filter(buyer_id=buyer_id).order_by("-created_at")

        return Response([
            {
                "id": o.id,
                "status": o.status,
                "total": float(o.total_amount),
                "items": [
                    {
                        "id": i.id,
                        "product_name": i.product.name,
                        "qty": i.quantity
                    } for i in o.items.all()
                ]
            } for o in orders
        ])

    # POST create order
    data = request.data
    buyer_id = data.get("buyer")
    items = data.get("items")

    if not buyer_id or not items:
        return Response({"message": "Missing buyer or items"}, status=400)

    order = Order.objects.create(buyer_id=buyer_id, status="Pending", total_amount=0)
    total = 0

    for item in items:
        product_id = item.get("product")
        qty = item.get("qty")

        if not product_id or not qty:
            continue

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"message": "Invalid product"}, status=400)

        if product.qty < qty:
            return Response({"message": f"Not enough stock for {product.name}"}, status=400)

        OrderItem.objects.create(
            order=order,
            product=product,
            quantity=qty,
            price=product.price
        )

        product.qty -= qty
        product.save()

        total += qty * product.price

    order.total_amount = total
    order.save()

    return Response({"order_id": order.id}, status=201)


@api_view(["POST"])
def cancel_order(request, pk):
    try:
        order = Order.objects.get(id=pk)
    except Order.DoesNotExist:
        return Response({"message": "Order not found"}, status=404)

    if order.status != "Pending":
        return Response({"message": "Cannot cancel processed order"}, status=400)

    order.status = "Cancelled"
    order.save()

    return Response({"message": "Order cancelled"})


# ---------------- FARMER REPORT ----------------

@api_view(['GET'])
def farmer_sales_report(request, farmer_id):
    items = OrderItem.objects.filter(product__farmer_id=farmer_id)

    total_orders = items.values("order").distinct().count()
    total_revenue = items.aggregate(
        total=Sum(F('price') * F('quantity'))
    )['total'] or 0

    product_sales = (
        items.values('product__name')
        .annotate(
            total_qty=Sum('quantity'),
            revenue=Sum(F('price') * F('quantity'))
        )
    )

    orders = (
        Order.objects.filter(items__product__farmer_id=farmer_id)
        .distinct()
        .order_by('-created_at')
    )

    order_list = [
        {
            "id": o.id,
            "total": float(o.total_amount),
            "status": o.status,
            "date": o.created_at.strftime("%Y-%m-%d")
        } for o in orders
    ]

    return Response({
        "total_orders": total_orders,
        "total_revenue": float(total_revenue),
        "product_sales": list(product_sales),
        "orders": order_list
    })
