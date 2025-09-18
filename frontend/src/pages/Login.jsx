import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", { email, password });

      alert(res.data.message || "Login successful");

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      navigate("/stores");
    } catch (err) {
      console.error("Login error:", err);
      alert("Error logging in: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container form-container">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Login</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
          <p className="text-center mt-3">
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
