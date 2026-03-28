import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Donor.css";

const DonorSettings = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    age: user?.age || "",
    contact: user?.contact || "",
    address: user?.address || "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const updates = { ...formData, age: Number(formData.age) };
    if (!updates.password) delete updates.password;

    try {
      const res = await fetch("/api/donor/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        setMessage("Profile updated successfully");
        setFormData({ ...formData, password: "" });
      } else {
        setError(data.error || "Update failed");
      }
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Account Settings</h2>

        <div className="profile-info">
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Blood Type:</strong> {user?.bloodType}</p>
          <p><strong>Status:</strong> {user?.active ? "Active" : "Inactive"}</p>
          {user?.lastDonationDate && (
            <p><strong>Last Donation:</strong> {new Date(user.lastDonationDate).toLocaleDateString()}</p>
          )}
        </div>

        <hr />

        {message && <p className="msg success">{message}</p>}
        {error && <p className="msg error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input name="name" value={formData.name} onChange={handleChange} required />

          <label>Age</label>
          <input name="age" type="number" value={formData.age} onChange={handleChange} required />

          <label>Phone</label>
          <input name="contact" value={formData.contact} onChange={handleChange} required />

          <label>Address</label>
          <input name="address" value={formData.address} onChange={handleChange} required />

          <label>New Password (leave empty to keep current)</label>
          <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Min 6 characters" />

          <button type="submit" className="btn-full">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default DonorSettings;
