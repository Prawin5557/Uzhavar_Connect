import { Link } from "react-router-dom";

function About() {
  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center p-0"
      style={{
        background: "linear-gradient(to bottom, #CFEAF7 0%, #B8DDEE 50%, #A9D3E8 100%)",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">

          <div className="col-lg-6 col-md-8 col-sm-11">
            <div className="card shadow border-0 rounded" style={{ padding: "1.8rem" }}>

              <h2 className="text-center text-success fw-bold mb-3">
                About UzhavarConnect
              </h2>

              <p className="text-muted">
                <strong>UzhavarConnect</strong> is a digital platform designed to bridge the gap between
                farmers and buyers by enabling direct communication, transparent pricing, and easy access
                to agricultural products.
              </p>

              <p className="text-muted">
                Our mission is to empower farmers with technology while giving buyers access to fresh,
                fairly priced produce — creating a transparent and sustainable agricultural ecosystem.
              </p>

              <ul className="text-muted">
                <li>Direct Farmer ↔ Buyer connection</li>
                <li>Fair and transparent pricing</li>
                <li>Digital marketplace for crops</li>
                <li>Supports rural digital transformation</li>
              </ul>

              <hr />

              <h6 className="text-success fw-bold mt-3">Contact Information</h6>
              <p className="text-muted mb-1">
                📧 Email: <a href="mailto:support@uzhavarconnect.com">support@uzhavarconnect.com</a>
              </p>
              <p className="text-muted mb-1">
                📞 Phone: +91 98765 43210
              </p>
              <p className="text-muted mb-2">
                📍 Address: Chennai, Tamil Nadu, India
              </p>

              <div className="text-center mt-3">
                <Link to="/" className="btn btn-success btn-sm px-4">
                  Back to Home
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default About;
