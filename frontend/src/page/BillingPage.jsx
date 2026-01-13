import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_BASE_URL } from "../config";

function BillingPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const cart = state?.cart || [];

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = cart.reduce((sum, p) => sum + p.price * p.qty, 0);
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  const handleOrder = async () => {
  if (!customer.name || !customer.phone || !customer.address) {
    return setError("Please fill all delivery details");
  }

  if (cart.length === 0) return;

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return navigate("/login");

  try {
    setLoading(true);
    setError("");

    const payload = {
      buyer: currentUser.id,
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      payment_method: paymentMethod,
      total,
      items: cart.map(p => ({
        product: p.id,
        qty: p.qty,
        price: p.price,
      })),
    };

    console.log("Sending order:", payload);

    const res = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/orders/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Backend error:", errText);
      throw new Error("Order failed");
    }

    alert("✅ Order placed successfully!");
    navigate("/buyer", { state: { refreshOrders: true } });

  } catch (err) {
    console.error(err);
    setError("Failed to place order. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="container py-5">
      <h2 className="fw-bold text-success mb-4">🧾 Checkout</h2>

      <div className="row">
        {/* Left Section */}
        <div className="col-md-7">
          <div className="card p-4 mb-4 shadow-sm">
            <h5 className="mb-3">Delivery Details</h5>

            <input
              className="form-control mb-2"
              placeholder="Full Name"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            />
            <input
              className="form-control mb-2"
              placeholder="Phone Number"
              value={customer.phone}
              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
            />
            <textarea
              className="form-control"
              placeholder="Delivery Address"
              rows={3}
              value={customer.address}
              onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
            />
          </div>

          <div className="card p-4 shadow-sm">
            <h5 className="mb-3">Payment Method</h5>
            {["COD", "UPI", "CARD"].map((m) => (
              <div className="form-check" key={m}>
                <input
                  className="form-check-input"
                  type="radio"
                  checked={paymentMethod === m}
                  onChange={() => setPaymentMethod(m)}
                />
                <label className="form-check-label">{m}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="col-md-5">
          <div className="card p-4 shadow-sm">
            <h5 className="mb-3">Order Summary</h5>

            {cart.map((p) => (
              <div key={p.id} className="d-flex justify-content-between border-bottom py-2">
                <span>{p.name} ({p.qty} kg)</span>
                <span>₹{p.price * p.qty}</span>
              </div>
            ))}

            <hr />
            <div className="d-flex justify-content-between">
              <span>Subtotal</span><span>₹{subtotal}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Delivery</span><span>₹{deliveryFee}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Tax (5%)</span><span>₹{tax}</span>
            </div>

            <h5 className="d-flex justify-content-between mt-3">
              <span>Total</span>
              <span className="text-success">₹{total}</span>
            </h5>

            {error && <div className="alert alert-danger mt-2">{error}</div>}

            <button
              className="btn btn-success w-100 mt-3"
              onClick={handleOrder}
              disabled={loading}
            >
              {loading ? "Placing Order..." : "Confirm Order"}
            </button>

            <button className="btn btn-outline-secondary w-100 mt-2" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillingPage;
