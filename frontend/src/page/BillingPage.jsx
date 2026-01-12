import { useLocation, useNavigate } from "react-router-dom";

function BillingPage() {
  const { state } = useLocation();
  const cart = state?.cart || [];
  const navigate = useNavigate();

  const total = cart.reduce((sum, p) => sum + p.price * p.qty, 0);

  return (
    <div className="container py-5">
      <h2 className="fw-bold text-success mb-4">🧾 Billing</h2>

      {cart.map((p) => (
        <div key={p.id} className="d-flex justify-content-between border-bottom py-2">
          <span>{p.name} ({p.qty} kg)</span>
          <span>₹{p.price * p.qty}</span>
        </div>
      ))}

      <h4 className="mt-4">Total: ₹{total}</h4>

      <button className="btn btn-success mt-3" onClick={() => alert("Order placed!")}>
        Place Order
      </button>

      <button className="btn btn-outline-secondary mt-3 ms-2" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
}

export default BillingPage;
