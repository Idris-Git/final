import { useState, useEffect } from "react";
import "../../styles/Admin.css";

const AdminHospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [message, setMessage] = useState("");

  const fetchHospitals = async () => {
    try {
      const res = await fetch("/api/admin/hospitals");
      const data = await res.json();
      if (res.ok) setHospitals(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const approveHospital = async (id) => {
    try {
      const res = await fetch(`/api/admin/hospitals/${id}/approve`, { method: "PUT" });
      if (res.ok) {
        setMessage("Hospital approved");
        fetchHospitals();
      }
    } catch {
      setMessage("Failed to approve");
    }
  };

  const removeHospital = async (id) => {
    if (!window.confirm("Are you sure you want to remove this hospital?")) return;
    try {
      const res = await fetch(`/api/admin/hospitals/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("Hospital removed");
        fetchHospitals();
      }
    } catch {
      setMessage("Failed to remove");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Manage Hospitals</h2>
        {message && <p className="msg">{message}</p>}

        {hospitals.length === 0 ? (
          <p className="empty">No hospitals registered</p>
        ) : (
          hospitals.map((h) => (
            <div key={h._id} className="request-item">
              <p><strong>{h.name}</strong></p>
              <p>Email: {h.email}</p>
              <p>Address: {h.address}</p>
              <p>Contact: {h.contact}</p>
              <p>Status: <span className={h.approved ? "text-green" : "text-red"}>
                {h.approved ? "Approved" : "Pending"}
              </span></p>
              <div className="btn-group">
                {!h.approved && <button onClick={() => approveHospital(h._id)}>Approve</button>}
                <button className="btn-danger" onClick={() => removeHospital(h._id)}>Remove</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminHospitals;
