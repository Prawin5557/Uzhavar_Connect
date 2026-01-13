import React, { useEffect, useState, useCallback, useMemo } from "react";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

function FarmerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState("PRODUCTS");

  const [form, setForm] = useState({ name: "", price: "", qty: "", image: "", category: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const perPage = 5;
  const safeBase = API_BASE_URL.replace(/\/$/, "");

  const currentUser = useMemo(() => {
    try {
      const raw = localStorage.getItem("currentUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!currentUser) navigate("/login");
  }, [currentUser, navigate]);

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  /* ---------------- Products ---------------- */

  const fetchProducts = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${safeBase}/products/`);
      const data = await res.json();
      setProducts(data.filter(p => p.farmer_id === currentUser.id));
    } catch {
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  }, [currentUser, safeBase]);

  /* ---------------- Orders ---------------- */

  const fetchOrders = useCallback(async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`${safeBase}/orders/?farmer=${currentUser.id}`);
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      console.error("Failed to fetch orders", e);
    }
  }, [currentUser, safeBase]);

  useEffect(() => {
    if (view === "PRODUCTS") fetchProducts();
    if (view === "ORDERS") fetchOrders();
  }, [view, fetchProducts, fetchOrders]);

  const acceptOrder = async (id) => {
    await fetch(`${safeBase}/orders/${id}/accept/`, { method: "POST" });
    fetchOrders();
  };

  const cancelOrder = async (id) => {
    await fetch(`${safeBase}/orders/${id}/cancel/`, { method: "POST" });
    fetchOrders();
  };

  const completeOrder = async (id) => {
    await fetch(`${safeBase}/orders/${id}/complete/`, { method: "POST" });
    fetchOrders();
  };

  /* ---------------- Filters ---------------- */

  const filtered = useMemo(() => {
    return products
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
      .filter(p => !categoryFilter || (p.category || "") === categoryFilter)
      .sort((a, b) => {
        if (sortBy === "price") return a.price - b.price;
        if (sortBy === "qty") return a.qty - b.qty;
        return a.name.localeCompare(b.name);
      });
  }, [products, search, sortBy, categoryFilter]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalValue = products.reduce((sum, p) => sum + p.price * p.qty, 0);
  const lowStock = products.filter(p => p.qty < 5).length;

  /* ---------------- Render ---------------- */

  return (
    <div className="container-fluid min-vh-100 py-4"
      style={{ background: "linear-gradient(to bottom, #CFEAF7 0%, #B8DDEE 50%, #A9D3E8 100%)" }}>

      <div className="container">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="text-success fw-bold">Farmer Dashboard</h2>
          <div className="d-flex gap-2">
            <button className={`btn ${view === "PRODUCTS" ? "btn-success" : "btn-outline-success"}`} onClick={() => setView("PRODUCTS")}>
              Products
            </button>
            <button className={`btn ${view === "ORDERS" ? "btn-success" : "btn-outline-success"}`} onClick={() => setView("ORDERS")}>
              Orders
            </button>
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* ORDERS VIEW */}
        {view === "ORDERS" && (
          <div className="card p-3 mb-4 shadow-sm">
            <h5>Received Orders</h5>
            {orders.length === 0 ? (
              <p className="text-muted text-center">No orders yet</p>
            ) : orders.map(o => (
              <div key={o.id} className="border rounded p-2 mb-2">
                <div className="d-flex justify-content-between">
                  <b>Order #{o.id}</b>
                  <span className={`status-badge status-${o.status}`}>{o.status}</span>
                </div>
                <ul className="mb-2">
                  {o.items.map(i => (
                    <li key={i.id}>{i.product_name} × {i.qty}</li>
                  ))}
                </ul>
                <div className="d-flex gap-2">
                  {o.status === "Pending" && (
                    <>
                      <button className="btn btn-sm btn-success" onClick={() => acceptOrder(o.id)}>Accept</button>
                      <button className="btn btn-sm btn-danger" onClick={() => cancelOrder(o.id)}>Reject</button>
                    </>
                  )}
                  {o.status === "Accepted" && (
                    <button className="btn btn-sm btn-primary" onClick={() => completeOrder(o.id)}>Mark Completed</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PRODUCTS VIEW */}
        {view === "PRODUCTS" && (
          <>
            {lowStock > 0 && <div className="alert alert-warning">⚠ {lowStock} product(s) have low stock!</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row mb-3">
              <div className="col">Total Products: <b>{products.length}</b></div>
              <div className="col">Low Stock: <b className="text-danger">{lowStock}</b></div>
              <div className="col">Inventory Value: <b className="text-primary">₹{totalValue}</b></div>
            </div>

            <div className="d-flex gap-2 mb-2">
              <input className="form-control" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
              <select className="form-select w-auto" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                <option value="">All</option>
                <option>Vegetables</option>
                <option>Fruits</option>
                <option>Grains</option>
              </select>
              <select className="form-select w-auto" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="qty">Qty</option>
              </select>
            </div>

            {/* Add/Edit Form */}
            <div className="card p-3 mb-4 shadow-sm">
              <h5>{editingId ? "Edit Product" : "Add Product"}</h5>
              <form className="row g-2" onSubmit={async e => {
                e.preventDefault();
                if (!form.name || !form.price || !form.qty) return alert("Fill all fields");
                setSaving(true);
                const payload = { ...form, price: Number(form.price), qty: Number(form.qty), farmer_id: currentUser.id };
                const url = editingId ? `${safeBase}/products/${editingId}/` : `${safeBase}/products/add/`;
                const method = editingId ? "PUT" : "POST";
                await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
                setForm({ name: "", price: "", qty: "", image: "", category: "" });
                setEditingId(null);
                fetchProducts();
                setSaving(false);
              }}>
                <input className="form-control col" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <input type="number" className="form-control col" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                <input type="number" className="form-control col" placeholder="Qty" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} />
                <select className="form-select col" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="">Category</option>
                  <option>Vegetables</option>
                  <option>Fruits</option>
                  <option>Grains</option>
                </select>
                <input type="file" className="form-control col" onChange={e => {
                  const r = new FileReader();
                  r.onloadend = () => setForm(prev => ({ ...prev, image: r.result }));
                  r.readAsDataURL(e.target.files[0]);
                }} />
                <button className="btn btn-success col" disabled={saving}>{saving ? "Saving..." : editingId ? "Update" : "Add"}</button>
              </form>
            </div>

            {/* Products Table */}
            <div className="card p-3 shadow-sm">
              <h5>Your Products</h5>
              <table className="table table-bordered mt-2">
                <thead className="table-success">
                  <tr>
                    <th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Qty</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(p => (
                    <tr key={p.id}>
                      <td>{p.image && <img src={p.image} width="50" />}</td>
                      <td>{p.name}</td>
                      <td>{p.category || "-"}</td>
                      <td>₹{p.price}</td>
                      <td className={p.qty < 5 ? "text-danger fw-bold" : ""}>{p.qty}</td>
                      <td>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => { setEditingId(p.id); setForm(p); }}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => fetch(`${safeBase}/products/${p.id}/delete/`, { method: "DELETE" }).then(fetchProducts)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="d-flex justify-content-center gap-2">
                <button className="btn btn-sm btn-outline-secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
                <span>Page {page}</span>
                <button className="btn btn-sm btn-outline-secondary" disabled={page * perPage >= filtered.length} onClick={() => setPage(p => p + 1)}>Next</button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default FarmerDashboard;
