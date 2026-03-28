import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Hospital.css";

const HospitalDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    patientName: "", patientAge: "", bloodType: "A+",
    emergencyLevel: "Low", requiredUnits: ""
  });

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/hospital/requests");
      const data = await res.json();
      if (res.ok) setRequests(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/hospital/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          patientAge: Number(formData.patientAge),
          requiredUnits: Number(formData.requiredUnits)
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Blood request created!");
        setFormData({ patientName: "", patientAge: "", bloodType: "A+", emergencyLevel: "Low", requiredUnits: "" });
        fetchRequests();
      } else {
        setMessage(data.error || "Failed to create request");
      }
    } catch {
      setMessage("Something went wrong");
    }
  };

  const completeRequest = async (id) => {
    try {
      const res = await fetch(`/api/hospital/requests/${id}/complete`, {
        method: "PUT",
      });
      const data = await res.json();
      if (res.ok) {
        fetchRequests();
      } else {
        setMessage(data.error || "Failed to complete");
      }
    } catch {
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Hospital Dashboard</h2>
        <p>Welcome, <strong>{user?.name}</strong></p>
        {!user?.approved && (
          <p className="msg error">Your hospital is pending admin approval. You cannot create requests yet.</p>
        )}

        {message && <p className="msg">{message}</p>}

        {user?.approved && (
          <>
            <hr />
            <h3>Create Blood Request</h3>
            <form onSubmit={handleSubmit}>
              <input name="patientName" placeholder="Patient Name" value={formData.patientName} onChange={handleChange} required />
              <input name="patientAge" type="number" placeholder="Patient Age" value={formData.patientAge} onChange={handleChange} required />
              <select name="bloodType" value={formData.bloodType} onChange={handleChange}>
                {bloodTypes.map((bt) => <option key={bt} value={bt}>{bt}</option>)}
              </select>
              <select name="emergencyLevel" value={formData.emergencyLevel} onChange={handleChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="Critical">Critical</option>
              </select>
              <input name="requiredUnits" type="number" placeholder="Required Units" value={formData.requiredUnits} onChange={handleChange} required />
              <button type="submit" className="btn-full">Create Request</button>
            </form>
          </>
        )}

        <hr />
        <h3>Your Blood Requests</h3>
        {requests.length === 0 ? (
          <p className="empty">No requests yet</p>
        ) : (
          requests.map((req) => (
            <div key={req._id} className="request-item">
              <p><strong>Patient:</strong> {req.patientName} (Age: {req.patientAge})</p>
              <p><strong>Blood Type:</strong> {req.bloodType} | <strong>Units:</strong> {req.requiredUnits}</p>
              <p><strong>Emergency:</strong> <span className={`emergency-${req.emergencyLevel.toLowerCase()}`}>{req.emergencyLevel}</span></p>
              <p><strong>Status:</strong> <span className={`status-${req.status.toLowerCase()}`}>{req.status}</span></p>
              {req.donorId && (
                <p><strong>Donor:</strong> {req.donorId.name} - {req.donorId.contact}</p>
              )}
              {req.status === "Accepted" && (
                <button onClick={() => completeRequest(req._id)}>Mark Completed</button>
              )}
              <p className="date">{new Date(req.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HospitalDashboard;
