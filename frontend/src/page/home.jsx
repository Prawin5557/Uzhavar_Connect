import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import farmer from "../assets/download.jpeg";

export default function Home() {
  return (
    <div className="min-vh-100" style={{ background: "linear-gradient(to bottom, #CFEAF7, #B8DDEE)" }}>
      
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="logo" width="40" className="me-2" />
          <strong className="text-success">UzhavarConnect</strong>
        </Link>
        <div className="ms-auto d-flex gap-2">
          <Link to="/login" className="btn btn-outline-success">Login</Link>
          <Link to="/signup" className="btn btn-success">Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h1 className="fw-bold text-success display-5">
              Connecting Farmers Directly With Buyers
            </h1>
            <p className="lead mt-3">
              Fair pricing, no middlemen, transparent agricultural trading platform.
            </p>
            <div className="d-flex gap-3 mt-4">
              <Link to="/signup?role=farmer" className="btn btn-success btn-lg">Join as Farmer</Link>
              <Link to="/signup?role=buyer" className="btn btn-outline-success btn-lg">Join as Buyer</Link>
            </div>
          </div>
          <div className="col-md-6 text-center">
            <img src={farmer} alt="farmer" className="img-fluid rounded shadow" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-5">
        <h2 className="text-center fw-bold text-success mb-4">Why UzhavarConnect?</h2>
        <div className="row g-4">
          {[
            ["Direct Trading", "Farmers sell directly to buyers"],
            ["Fair Pricing", "No middlemen means better profits"],
            ["Live Marketplace", "Real-time product updates"],
            ["Secure Payments", "Safe & transparent transactions"],
            ["Easy Dashboards", "Simple farmer & buyer management"],
            ["Fast Delivery", "Efficient logistics support"]
          ].map((f, i) => (
            <div key={i} className="col-md-4">
              <div className="card h-100 shadow-sm p-3">
                <h5 className="text-success">{f[0]}</h5>
                <p className="mb-0">{f[1]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Who is it for */}
      <section className="container py-5">
        <h2 className="text-center fw-bold text-success mb-4">Who Can Use This?</h2>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card shadow-sm p-4 h-100">
              <h4 className="text-success">🌾 Farmers</h4>
              <ul>
                <li>Sell directly</li>
                <li>Better income</li>
                <li>Easy product listing</li>
              </ul>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm p-4 h-100">
              <h4 className="text-success">🛒 Buyers</h4>
              <ul>
                <li>Fresh produce</li>
                <li>Direct from farms</li>
                <li>Fair pricing</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-5">
        <div className="container text-center">
          <div className="row">
            <div className="col-md-4"><h2 className="text-success">500+</h2><p>Farmers</p></div>
            <div className="col-md-4"><h2 className="text-success">1200+</h2><p>Buyers</p></div>
            <div className="col-md-4"><h2 className="text-success">10K+</h2><p>Orders</p></div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container py-5">
        <h2 className="text-center fw-bold text-success mb-4">What Users Say</h2>
        <div className="row g-4">
          <div className="col-md-4"><div className="card shadow-sm p-3">“Better income & no middlemen!”</div></div>
          <div className="col-md-4"><div className="card shadow-sm p-3">“Fresh produce directly from farms.”</div></div>
          <div className="col-md-4"><div className="card shadow-sm p-3">“Very easy and transparent platform.”</div></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-success text-white py-4 text-center">
        <p className="mb-1">© 2026 UzhavarConnect</p>
        <small>Empowering farmers through technology 🌾</small>
      </footer>
    </div>
  );
}
