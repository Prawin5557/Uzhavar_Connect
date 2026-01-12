import React, { useEffect, useState, useCallback } from "react";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

function BuyerDashboard() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addToCart = (product, qty) => {
    if (!qty || qty < 1) return alert("Quantity must be at least 1");

    setCart((prev) => {
      const existing = prev.find((c) => c.id === product.id);
      if (existing) {
        return prev.map((c) =>
          c.id === product.id ? { ...c, qty: c.qty + qty } : c
        );
      }
      return [...prev, { ...product, qty }];
    });
  };

  const goToBilling = () => {
    if (cart.length === 0) return alert("Cart is empty");
    navigate("/billing", { state: { cart } });
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-success">🌿 Marketplace</h2>

        <div className="d-flex gap-2">
          <button className="btn btn-outline-success" onClick={goToBilling}>
            🛒 Cart ({cart.length})
          </button>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {loading && <p className="text-muted">Loading products...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && products.length === 0 && !error && (
        <p className="text-muted">No products available.</p>
      )}

      <div className="row">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={addToCart} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, onAdd }) {
  const [qty, setQty] = useState(1);
  const safeQty = isNaN(qty) || qty < 1 ? 1 : qty;

  return (
    <div className="col-md-4 mb-4">
      <div className="card border-0 shadow-lg h-100 premium-card">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="card-img-top rounded-top"
            style={{ height: "180px", objectFit: "cover" }}
          />
        )}

        <div className="card-body">
          <h5 className="fw-bold text-success">{product.name}</h5>
          <p className="mb-1">₹{product.price} / kg</p>
          <p className="text-muted small">Available: {product.qty} kg</p>

          <div className="d-flex align-items-center mb-3">
            <input
              type="number"
              min="1"
              className="form-control me-2"
              value={safeQty}
              onChange={(e) => setQty(Number(e.target.value))}
            />
            <span>kg</span>
          </div>

          <button
            className="btn btn-success w-100"
            onClick={() => onAdd(product, safeQty)}
          >
            ➕ Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default BuyerDashboard;
