import { useState, useEffect } from "react";
import "../../styles/Donor.css";

const DonorHistory = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/donor/history");
        const data = await res.json();
        if (res.ok) setDonations(data);
      } catch {
        // ignore
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="page">
      <div className="card">
        <h2>Donation History</h2>

        {donations.length === 0 ? (
          <p className="empty">No donation history yet</p>
        ) : (
          donations.map((d) => (
            <div key={d._id} className="request-item">
              <p><strong>Patient:</strong> {d.patientName}</p>
              <p><strong>Blood Type:</strong> {d.bloodType}</p>
              <p><strong>Units:</strong> {d.requiredUnits}</p>
              <p><strong>Hospital:</strong> {d.hospitalId?.name}</p>
              <p><strong>Status:</strong> <span className={`status-${d.status.toLowerCase()}`}>{d.status}</span></p>
              <p><strong>Date:</strong> {new Date(d.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DonorHistory;
