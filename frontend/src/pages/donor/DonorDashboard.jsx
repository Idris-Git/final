import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Donor.css";

const DonorDashboard = () => {
  const { user, setUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/donor/requests");
      const data = await res.json();
      if (res.ok) setRequests(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const toggleStatus = async () => {
    try {
      const res = await fetch("/api/donor/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !user.active }),
      });
      const data = await res.json();
      if (res.ok) setUser(data);
    } catch {
      // ignore
    }
  };

  const acceptRequest = async (id) => {
    setMessage("");
    try {
      const res = await fetch(`/api/donor/requests/${id}/accept`, {
        method: "PUT",
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Request accepted!");
        fetchRequests();
      } else {
        setMessage(data.error || "Failed to accept");
      }
    } catch {
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Donor Dashboard</h2>
        <p>Welcome, <strong>{user?.name}</strong></p>
        <p>Blood Type: <strong>{user?.bloodType}</strong></p>
        <p>Status: <strong className={user?.active ? "text-green" : "text-red"}>
          {user?.active ? "Active" : "Inactive"}
        </strong></p>
        <button onClick={toggleStatus}>
          {user?.active ? "Set Inactive" : "Set Active"}
        </button>

        {message && <p className="msg">{message}</p>}

        <hr />
        <h3>Matching Blood Requests</h3>

        {requests.length === 0 ? (
          <p className="empty">No matching requests right now</p>
        ) : (
          requests.map((req) => (
            <div key={req._id} className="request-item">
              <p><strong>Patient:</strong> {req.patientName} (Age: {req.patientAge})</p>
              <p><strong>Blood Type:</strong> {req.bloodType}</p>
              <p><strong>Emergency:</strong> <span className={`emergency-${req.emergencyLevel.toLowerCase()}`}>{req.emergencyLevel}</span></p>
              <p><strong>Units Needed:</strong> {req.requiredUnits}</p>
              <p><strong>Hospital:</strong> {req.hospitalId?.name} - {req.hospitalId?.address}</p>
              <button onClick={() => acceptRequest(req._id)}>Accept</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DonorDashboard;
