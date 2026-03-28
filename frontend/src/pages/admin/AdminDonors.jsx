import { useState, useEffect } from "react";
import "../../styles/Admin.css";

const AdminDonors = () => {
  const [donors, setDonors] = useState([]);
  const [message, setMessage] = useState("");

  const fetchDonors = async () => {
    try {
      const res = await fetch("/api/admin/donors");
      const data = await res.json();
      if (res.ok) setDonors(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const removeDonor = async (id) => {
    if (!window.confirm("Are you sure you want to remove this donor?")) return;
    try {
      const res = await fetch(`/api/admin/donors/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("Donor removed");
        fetchDonors();
      }
    } catch {
      setMessage("Failed to remove");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Manage Donors</h2>
        {message && <p className="msg">{message}</p>}

        {donors.length === 0 ? (
          <p className="empty">No donors registered</p>
        ) : (
          donors.map((d) => (
            <div key={d._id} className="request-item">
              <p><strong>{d.name}</strong></p>
              <p>Email: {d.email}</p>
              <p>Blood Type: {d.bloodType}</p>
              <p>Contact: {d.contact}</p>
              <p>Location: {d.address}</p>
              <p>Status: <span className={d.active ? "text-green" : "text-red"}>
                {d.active ? "Active" : "Inactive"}
              </span></p>
              <button className="btn-danger" onClick={() => removeDonor(d._id)}>Remove</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDonors;
