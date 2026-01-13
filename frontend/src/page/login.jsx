import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_BASE_URL } from "../config";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password || !form.role) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || data.error || "Login failed");
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(data.user));

      if (data.user.role === "farmer") navigate("/farmer");
      else if (data.user.role === "buyer") navigate("/buyer");

    } catch {
      alert("Server not reachable");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center p-0" style={{ background: "linear-gradient(to bottom, #CFEAF7 0%, #B8DDEE 50%, #A9D3E8 100%)" }}>
      <div className="container">
        <div className="position-absolute top-0 start-0 m-3">
          <Link to="/home" className="btn btn-success">Back</Link>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-6 col-sm-10">
            <div className="card shadow border-0 rounded" style={{ padding: "1.5rem" }}>
              <h3 className="text-center text-success fw-bold mb-3">Login</h3>

              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <label>Email Address</label>
                  <input type="email" className="form-control form-control-sm"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>

                <div className="mb-2">
                  <label>Password</label>
                  <input type="password" className="form-control form-control-sm"
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                </div>

                <div className="mb-2">
                  <label>Login As</label>
                  <select className="form-select form-select-sm"
                    value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                    <option value="">Select role</option>
                    <option value="farmer">Farmer</option>
                    <option value="buyer">Buyer</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-success w-100 btn-sm mt-3">Login</button>

                <p className="text-center mt-2 mb-0 small">
                  Don't have an account? <Link to="/signup">Signup</Link>
                </p>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
