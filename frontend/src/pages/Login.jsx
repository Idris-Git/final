import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

const Login = () => {
  const [activeTab, setActiveTab] = useState("donor");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const loginEndpoints = {
    donor: "/api/auth/login",
    hospital: "/api/hospital/login",
    admin: "/api/admin/login",
  };

  const dashboardPaths = {
    donor: "/donor",
    hospital: "/hospital",
    admin: "/admin",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(loginEndpoints[activeTab], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      login(data, activeTab);
      navigate(dashboardPaths[activeTab]);
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div className="page">
      <div className="auth-card">
        <h2>Login</h2>

        <div className="tabs">
          <button
            className={activeTab === "donor" ? "tab active" : "tab"}
            onClick={() => setActiveTab("donor")}
          >
            Donor
          </button>
          <button
            className={activeTab === "hospital" ? "tab active" : "tab"}
            onClick={() => setActiveTab("hospital")}
          >
            Hospital
          </button>
          <button
            className={activeTab === "admin" ? "tab active" : "tab"}
            onClick={() => setActiveTab("admin")}
          >
            Admin
          </button>
        </div>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button type="submit" className="btn-full">Login</button>
        </form>

        {activeTab !== "admin" && (
          <p className="auth-link">
            Don't have an account?{" "}
            <Link to={activeTab === "donor" ? "/signup/donor" : "/signup/hospital"}>
              Sign up as {activeTab}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
