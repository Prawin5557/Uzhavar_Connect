import React, { useEffect, useState, useMemo, useCallback } from "react";
import { API_BASE_URL } from "../config";
import { useNavigate, useLocation } from "react-router-dom";
import "./BuyerDashboard.css";

function BuyerDashboard() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState("MARKET");
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [sort, setSort] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const safeBase = API_BASE_URL.replace(/\/$/, "");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  /* ---------------- Auth Guard ---------------- */

  useEffect(() => {
    if (!currentUser) navigate("/login");
  }, [currentUser, navigate]);

  /* ---------------- Products ---------------- */

  useEffect(() => {
    if (!currentUser) return;

    let ignore = false;

    (async () => {
      try {
        const res = await fetch(`${safeBase}/products/`);
        const data = await res.json();
        if (!ignore) setProducts(data);
      } catch {
        if (!ignore) setError("Unable to load products");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => { ignore = true; };
  }, [safeBase, currentUser]);

  /* ---------------- Orders ---------------- */

  const loadOrders = useCallback(async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`${safeBase}/orders/?buyer=${currentUser.id}`);
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      console.error("Failed to load orders", e);
    }
  }, [safeBase, currentUser]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  /* ---------------- Refresh Orders From Navigation ---------------- */

  useEffect(() => {
    if (location.state?.refreshOrders !== true) return;

    loadOrders();
    setView("ORDERS");

    navigate(location.pathname, { replace: true, state: null });
  }, [location.state?.refreshOrders, loadOrders, navigate, location.pathname]);

  /* ---------------- Derived State ---------------- */

  const filteredProducts = useMemo(() => {
    return [...products]
      .filter(p => p.name?.toLowerCase().includes(search.toLowerCase()))
      .filter(p => category === "ALL" || (p.category || "") === category)
      .sort((a, b) =>
        sort === "PRICE_ASC" ? a.price - b.price :
        sort === "PRICE_DESC" ? b.price - a.price : 0
      );
  }, [products, search, category, sort]);

  const total = useMemo(() => cart.reduce((s, i) => s + i.qty * i.price, 0), [cart]);
  const totalQty = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);

  /* ---------------- Cart Actions ---------------- */

  const addToCart = (product) => {
    setCart(prev => {
      const found = prev.find(p => p.id === product.id);
      if (found && found.qty < product.qty)
        return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
      if (found) return prev;
      return [...prev, { ...product, qty: 1 }];
    });
    setShowCart(true);
  };

  const changeQty = (id, delta) => {
    setCart(prev =>
      prev.map(p => p.id === id ? { ...p, qty: Math.max(1, p.qty + delta) } : p)
    );
  };

  const removeFromCart = id => setCart(prev => prev.filter(p => p.id !== id));
  const clearCart = () => window.confirm("Clear cart?") && setCart([]);

  /* ---------------- Order Cancel ---------------- */

  const cancelOrder = async (id) => {
    if (!window.confirm("Cancel this order?")) return;
    await fetch(`${safeBase}/orders/${id}/cancel/`, { method: "POST" });
    loadOrders();
  };

  /* ---------------- Render Guards ---------------- */

  if (loading) return <div className="container py-5 text-center">Loading marketplace…</div>;
  if (error) return <div className="container py-5 text-center text-danger">{error}</div>;

  /* ---------------- UI ---------------- */

  return (
    <div className="container-fluid bg-light min-vh-100 py-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
        <div>
          <h4 className="fw-bold text-success mb-0">Buyer Dashboard</h4>
          <small className="text-muted">Welcome {currentUser?.name}</small>
        </div>
        <div className="d-flex gap-2">
          <button className={`btn btn-sm ${view === "MARKET" ? "btn-success" : "btn-outline-success"}`} onClick={() => setView("MARKET")}>Marketplace</button>
          <button className={`btn btn-sm ${view === "ORDERS" ? "btn-success" : "btn-outline-success"}`} onClick={() => setView("ORDERS")}>My Orders</button>
          <button className="btn btn-sm btn-outline-primary" onClick={() => setShowCart(true)}>Cart ({totalQty})</button>
          <button className="btn btn-sm btn-outline-danger" onClick={() => { localStorage.clear(); navigate("/login"); }}>Logout</button>
        </div>
      </div>

      {/* Marketplace */}
      {view === "MARKET" && (
        <>
          <div className="d-flex gap-2 mb-3">
            <input className="form-control" placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
            <select className="form-select w-auto" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="ALL">All</option>
              <option>Vegetables</option>
              <option>Fruits</option>
              <option>Grains</option>
            </select>
            <select className="form-select w-auto" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="">Sort</option>
              <option value="PRICE_ASC">Price ↑</option>
              <option value="PRICE_DESC">Price ↓</option>
            </select>
          </div>

          <div className="row g-3">
            {filteredProducts.map(p => (
              <div className="col-md-3" key={p.id}>
                <div className="card product-card h-100 shadow-sm">
                  {p.image ? (
                    <img src={p.image} className="card-img-top" style={{ height: 150, objectFit: "cover" }} />
                  ) : (
                    <div className="skeleton" />
                  )}
                  <div className="card-body d-flex flex-column">
                    <h6 className="fw-semibold">{p.name}</h6>
                    <small className="text-muted mb-1">₹{p.price} / kg</small>
                    <small className="text-muted mb-2">Stock: {p.qty}</small>
                    <button className="btn btn-success btn-sm mt-auto" disabled={p.qty === 0} onClick={() => addToCart(p)}>
                      {p.qty === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Orders */}
      {view === "ORDERS" && (
        <div className="row g-3">
          {orders.length === 0 && <p className="text-center text-muted py-5">📦 No orders placed yet</p>}
          {orders.map(o => (
            <div className="col-md-4" key={o.id}>
              <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body">
                  <h6>Order #{o.id}</h6>
                  <span className={`status-badge status-${o.status}`}>{o.status}</span>
                  <ul className="mt-2">{o.items.map(i => <li key={i.id}>{i.product_name} × {i.qty}</li>)}</ul>
                  {o.status === "Pending" && (
                    <button className="btn btn-sm btn-outline-danger" onClick={() => cancelOrder(o.id)}>Cancel</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cart Panel */}
      {showCart && (
        <div className="position-fixed top-0 end-0 bg-white shadow-lg p-3 cart-panel" style={{ width: 340, height: "100vh", zIndex: 1050 }}>
          <h5>My Cart</h5>
          {cart.length === 0 && <p className="text-muted text-center py-4">🛒 Cart is empty</p>}
          {cart.map(p => (
            <div key={p.id} className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
              <div>
                <b>{p.name}</b>
                <div className="text-muted small">₹{p.price} × {p.qty}</div>
              </div>
              <div className="d-flex align-items-center gap-1">
                <button className="btn btn-sm btn-light" onClick={() => changeQty(p.id, -1)}>-</button>
                <span>{p.qty}</span>
                <button className="btn btn-sm btn-light" onClick={() => changeQty(p.id, 1)}>+</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(p.id)}>✕</button>
              </div>
            </div>
          ))}
          <hr />
          <b>Total: ₹{total}</b>
          <div className="d-grid gap-2 mt-2">
            <button className="btn btn-success" disabled={!cart.length} onClick={() => navigate("/billing", { state: { cart } })}>Proceed to Billing</button>
            <button className="btn btn-outline-danger" onClick={clearCart}>Clear Cart</button>
            <button className="btn btn-outline-secondary" onClick={() => setShowCart(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuyerDashboard;
