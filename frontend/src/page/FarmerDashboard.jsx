import React, { useEffect, useState, useCallback, useMemo } from "react";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

function FarmerDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", qty: "", image: "", category: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const currentUser = useMemo(() => {
    const raw = localStorage.getItem("currentUser");
    return raw ? JSON.parse(raw) : null;
  }, []);

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const fetchProducts = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/products/`);
      const data = await res.json();
      setProducts(data.filter(p => p.farmer_id === currentUser.id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleImage = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm(prev => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert("Not logged in");

    const payload = {
      ...form,
      price: Number(form.price),
      qty: Number(form.qty),
      farmer_id: currentUser.id
    };

    try {
      if (editingId) {
        await fetch(`${API_BASE_URL}/products/${editingId}/`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        alert("Product updated");
      } else {
        await fetch(`${API_BASE_URL}/products/add/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        alert("Product added");
      }

      setForm({ name: "", price: "", qty: "", image: "", category: "" });
      setEditingId(null);
      fetchProducts();
    } catch {
      alert("Save failed");
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      price: p.price,
      qty: p.qty,
      image: p.image || "",
      category: p.category || ""
    });
    setEditingId(p.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await fetch(`${API_BASE_URL}/products/${id}/delete/`, { method: "DELETE" });
    fetchProducts();
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = products.reduce((sum, p) => sum + p.price * p.qty, 0);
  const lowStock = products.filter(p => p.qty < 5).length;

  return (
    <div className="container py-4">

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-success fw-bold">Farmer Dashboard</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="row mb-3">
        <div className="col">Total Products: <b>{products.length}</b></div>
        <div className="col">Low Stock: <b className="text-danger">{lowStock}</b></div>
        <div className="col">Inventory Value: <b className="text-primary">₹{totalValue}</b></div>
      </div>

      <input
        className="form-control mb-2"
        placeholder="Search product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="card p-3 mb-4 shadow-sm">
        <h5>{editingId ? "Edit Product" : "Add Product"}</h5>
        <form className="row g-2" onSubmit={handleSubmit}>
          <input className="form-control col" placeholder="Name" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} required />

          <input type="number" className="form-control col" placeholder="Price" value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })} required />

          <input type="number" className="form-control col" placeholder="Qty" value={form.qty}
            onChange={e => setForm({ ...form, qty: e.target.value })} required />

          <select className="form-control col" value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}>
            <option value="">Category</option>
            <option>Vegetables</option>
            <option>Fruits</option>
            <option>Grains</option>
          </select>

          <input type="file" className="form-control col" accept="image/*"
            onChange={e => handleImage(e.target.files[0])} />

          <button className="btn btn-success col">
            {editingId ? "Update" : "Add"}
          </button>
        </form>

        {form.image && <img src={form.image} width="80" className="mt-2 rounded" />}
      </div>

      <div className="card p-3 shadow-sm">
        <h5>Your Products</h5>
        {loading ? <p>Loading...</p> : (
          <table className="table table-bordered mt-2">
            <thead className="table-success">
              <tr>
                <th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Qty</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>{p.image && <img src={p.image} width="50" />}</td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>₹{p.price}</td>
                  <td className={p.qty < 5 ? "text-danger fw-bold" : ""}>
                    {p.qty} {p.qty < 5 && "⚠"}
                  </td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(p)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default FarmerDashboard;
