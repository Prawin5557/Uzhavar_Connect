import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_BASE_URL } from "../config";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    dob: "",
    email: "",
    address: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",
    terms: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password || !form.role) {
      alert("Please fill required fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!form.terms) {
      alert("Accept terms & conditions");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      alert("Signup successful!");
      navigate("/login");

    } catch {
      alert("Server not reachable");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center p-0"
      style={{ background: "linear-gradient(to bottom, #CFEAF7 0%, #B8DDEE 50%, #A9D3E8 100%)" }}>
      <div className="position-absolute top-0 start-0 m-3">
        <Link to="/home" className="btn btn-success">Back</Link>
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-6 col-sm-10">
            <div className="card shadow border-0 rounded" style={{ padding: "1.5rem" }}>
              <h3 className="text-center text-success fw-bold mb-3">Signup</h3>

              <form onSubmit={handleSubmit}>
                <input className="form-control form-control-sm mb-2" placeholder="Full Name"
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />

                <input type="date" className="form-control form-control-sm mb-2"
                  onChange={(e) => setForm({ ...form, dob: e.target.value })} />

                <input type="email" className="form-control form-control-sm mb-2" placeholder="Email"
                  onChange={(e) => setForm({ ...form, email: e.target.value })} />

                <textarea className="form-control form-control-sm mb-2" rows="2" placeholder="Address"
                  onChange={(e) => setForm({ ...form, address: e.target.value })}></textarea>

                <input type="tel" className="form-control form-control-sm mb-2" placeholder="Phone"
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} />

                <select className="form-select form-select-sm mb-2"
                  onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="">Select role</option>
                  <option value="farmer">Farmer</option>
                  <option value="buyer">Buyer</option>
                </select>

                <input type="password" className="form-control form-control-sm mb-2" placeholder="Password"
                  onChange={(e) => setForm({ ...form, password: e.target.value })} />

                <input type="password" className="form-control form-control-sm mb-2" placeholder="Confirm Password"
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />

                <div className="form-check mb-2">
                  <input type="checkbox" className="form-check-input"
                    onChange={(e) => setForm({ ...form, terms: e.target.checked })} />
                  <label className="form-check-label small">Accept terms</label>
                </div>

                <button type="submit" className="btn btn-success w-100 btn-sm mt-2">Signup</button>

                <p className="text-center mt-2 mb-0 small">
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
