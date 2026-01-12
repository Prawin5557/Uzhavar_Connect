import { Link } from "react-router-dom";
import logo from "../assets/./logo.png";
import farmer from "../assets/./download.jpeg";

function Home() {
  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center p-0"
      style={{
        background: "linear-gradient(to bottom, #CFEAF7 0%, #B8DDEE 50%, #A9D3E8 100%)",
      }}
    >
      <div className="container">
        <div className="row align-items-center">

          {/* Left Content */}
          <div className="col-md-6 text-center text-md-start">
            <img src={logo} alt="UzhavarConnect Logo" style={{ width: "120px" }} className="mb-3" />

            <h1 className="fw-bold text-success">Uzhavar<span style={{ color: "orange" }}>Connect</span></h1>
            <p className="lead">
              Connecting farmers directly with buyers using smart digital solutions.
            </p>

            <div className="mt-4 d-flex gap-3 justify-content-center justify-content-md-start">
              <Link to="/login" className="btn btn-success px-4">
                Login
              </Link>
              <Link to="/signup" className="btn btn-outline-success px-4">
                Signup
              </Link>
              <Link to="/about" className="btn btn-warning px-4">
                About
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="col-md-6 text-center mt-5 mt-md-0">
            <img
              src={farmer}
              alt="Farmer"
              className="img-fluid rounded shadow"
              style={{ maxHeight: "550px" }}
            />
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;
