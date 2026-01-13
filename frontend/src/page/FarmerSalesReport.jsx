import { useEffect, useState, useMemo } from "react";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

function FarmerReport() {
  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser"));
    } catch {
      return null;
    }
  }, []);

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bank, setBank] = useState({ name: "", account: "", ifsc: "" });

  const safeBase = API_BASE_URL.replace(/\/$/, "");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetch(`${safeBase}/farmer/${user.id}/sales/`)
      .then(res => res.json())
      .then(data => {
        setReport(data);
        setLoading(false);
      });
  }, [user, safeBase, navigate]);

  if (loading) return <div className="text-center mt-5">Loading report...</div>;
  if (!report) return <div className="text-center mt-5 text-danger">Failed to load report</div>;

  const avgOrder = report.total_orders > 0
    ? Math.round(report.total_revenue / report.total_orders)
    : 0;

  const availableBalance = report.total_revenue; // simulate full available

  const handleWithdraw = () => {
    if (!withdrawAmount || withdrawAmount <= 0) return alert("Enter valid amount");
    if (withdrawAmount > availableBalance) return alert("Insufficient balance");
    if (!bank.name || !bank.account || !bank.ifsc) return alert("Fill bank details");

    alert(`✅ Withdrawal of ₹${withdrawAmount} requested successfully!`);
    setShowWithdraw(false);
    setWithdrawAmount("");
    setBank({ name: "", account: "", ifsc: "" });
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold text-success mb-4">📊 Sales Analytics</h3>

      {/* KPI CARDS */}
      <div className="row g-3 mb-4">
        <KPI title="Total Orders" value={report.total_orders} color="primary" />
        <KPI title="Revenue" value={`₹${report.total_revenue}`} color="success" />
        <KPI title="Avg Order Value" value={`₹${avgOrder}`} color="warning" />
      </div>

      {/* Withdraw Earnings */}
      <div className="card shadow-sm mb-4">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h6 className="mb-1">Available Balance</h6>
            <h4 className="fw-bold text-success">₹{availableBalance}</h4>
          </div>
          <button className="btn btn-success" onClick={() => setShowWithdraw(true)}>
            Withdraw Earnings
          </button>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="mb-3">Withdraw Earnings</h5>

            <input
              className="form-control mb-2"
              placeholder="Amount"
              type="number"
              value={withdrawAmount}
              onChange={e => setWithdrawAmount(e.target.value)}
            />

            <input
              className="form-control mb-2"
              placeholder="Bank Name"
              value={bank.name}
              onChange={e => setBank({ ...bank, name: e.target.value })}
            />

            <input
              className="form-control mb-2"
              placeholder="Account Number"
              value={bank.account}
              onChange={e => setBank({ ...bank, account: e.target.value })}
            />

            <input
              className="form-control mb-2"
              placeholder="IFSC Code"
              value={bank.ifsc}
              onChange={e => setBank({ ...bank, ifsc: e.target.value })}
            />

            <div className="d-flex gap-2">
              <button className="btn btn-success" onClick={handleWithdraw}>Confirm</button>
              <button className="btn btn-outline-secondary" onClick={() => setShowWithdraw(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Product Sales */}
      <div className="card shadow-sm mb-4">
        <div className="card-header fw-bold">Product-wise Sales</div>
        <table className="table mb-0">
          <thead className="table-light">
            <tr>
              <th>Product</th>
              <th>Qty Sold</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {report.product_sales.map((p, i) => (
              <tr key={i}>
                <td>{p.product__name}</td>
                <td>{p.total_qty}</td>
                <td>₹{p.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Orders */}
      <div className="card shadow-sm">
        <div className="card-header fw-bold">Recent Orders</div>
        <ul className="list-group list-group-flush">
          {report.orders.length === 0 && (
            <li className="list-group-item text-muted text-center">No orders yet</li>
          )}
          {report.orders.map(o => (
            <li key={o.id} className="list-group-item d-flex justify-content-between">
              <span>Order #{o.id}</span>
              <span>₹{o.total}</span>
              <span className={`badge bg-${o.status === "pending" ? "warning" : "success"}`}>
                {o.status}
              </span>
              <span className="text-muted">{o.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function KPI({ title, value, color }) {
  return (
    <div className="col-md-4">
      <div className={`card border-0 shadow-sm bg-${color} bg-opacity-10`}>
        <div className="card-body">
          <h6 className="text-muted">{title}</h6>
          <h3 className="fw-bold text-dark">{value}</h3>
        </div>
      </div>
    </div>
  );
}

export default FarmerReport;
