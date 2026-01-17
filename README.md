# 🌾 UzhavarConnect

UzhavarConnect is a full-stack web application designed to connect **farmers directly with buyers**, eliminating middlemen and enabling transparent, fair, and digital agricultural trade.

It empowers farmers to sell produce at fair prices and allows buyers to purchase directly from the source.

---

## 🚀 Tech Stack

### Frontend
- React (Vite)
- Bootstrap 
- Fetch API

### Backend
- Django
- Django REST Framework
- SQLite 

### Authentication
- Email & password login
- Role-based access control (Farmer, Buyer,admin (admin need to add))

---

## 👥 User Roles

### Farmer
- Add / edit / delete products
- Upload product images
- Manage availability
- View orders

### Buyer
- Browse products
- View product details
- Place orders
- Track order status

### Admin  ( need to add in future)
- View and manage users
- Approve / block accounts
- Monitor platform activity

---

## ✨ Features

- Role-based dashboards
- Secure authentication system
- Product CRUD operations
- Image upload support
- Order tracking system
- Responsive UI
- REST API integration
- CORS enabled frontend-backend communication

---

## ⚙️ Installation

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
