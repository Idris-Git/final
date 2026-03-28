import { useState, useEffect } from "react";
import "../../styles/Admin.css";

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/admin/requests");
        const data = await res.json();
        if (res.ok) setRequests(data);
      } catch {
        // ignore
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="page">
      <div className="card">
        <h2>All Blood Requests</h2>

        {requests.length === 0 ? (
          <p className="empty">No blood requests</p>
        ) : (
          requests.map((req) => (
            <div key={req._id} className="request-item">
              <p><strong>Patient:</strong> {req.patientName} (Age: {req.patientAge})</p>
              <p><strong>Blood Type:</strong> {req.bloodType} | <strong>Units:</strong> {req.requiredUnits}</p>
              <p><strong>Emergency:</strong> <span className={`emergency-${req.emergencyLevel.toLowerCase()}`}>{req.emergencyLevel}</span></p>
              <p><strong>Hospital:</strong> {req.hospitalId?.name || "N/A"}</p>
              <p><strong>Donor:</strong> {req.donorId?.name || "Not assigned"}</p>
              <p><strong>Status:</strong> <span className={`status-${req.status.toLowerCase()}`}>{req.status}</span></p>
              <p className="date">{new Date(req.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminRequests;
