import React from "react";
import { BrowserRouter as Router, Link, useNavigate } from "react-router-dom";
import AppRoutes from "./routes";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          StoreApp
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
            {user && (
              <>
                <li className="nav-item me-3">
                  <span className="nav-link" style={{ color: "#ffc107", fontWeight: "bold" }}>
                    Hello, {user.name}
                  </span>
                </li>
                <li className="nav-item ms-auto">
                  <button
                    className="btn btn-danger"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
            <li className="nav-item ms-3">
              <Link className="nav-link" to="/stores">
                Stores
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <AppRoutes />
    </Router>
  );
}
