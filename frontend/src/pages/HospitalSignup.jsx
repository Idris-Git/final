import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

const HospitalSignup = () => {
  const [formData, setFormData] = useState({
    name: "", address: "", contact: "", email: "", password: ""
  });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/hospital/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      login(data, "hospital");
      navigate("/hospital");
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div className="page">
      <div className="auth-card">
        <h2>Hospital Registration</h2>
        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Hospital Name" value={formData.name} onChange={handleChange} required />
          <input name="address" placeholder="Address / City" value={formData.address} onChange={handleChange} required />
          <input name="contact" placeholder="Phone Number" value={formData.contact} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password (min 6 chars)" value={formData.password} onChange={handleChange} required />
          <button type="submit" className="btn-full">Register</button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default HospitalSignup;
