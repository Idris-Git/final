import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Admin.css";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/admin/reports");
        const data = await res.json();
        if (res.ok) setReports(data);
      } catch {
        // ignore
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="page">
      <div className="card">
        <h2>Admin Dashboard</h2>
        <p>Welcome, <strong>{user?.name}</strong></p>

        <hr />
        <h3>System Reports</h3>

        {reports ? (
          <div className="reports-grid">
            <div className="report-box">
              <h4>{reports.totalDonors}</h4>
              <p>Total Donors</p>
            </div>
            <div className="report-box">
              <h4>{reports.activeDonors}</h4>
              <p>Active Donors</p>
            </div>
            <div className="report-box">
              <h4>{reports.totalHospitals}</h4>
              <p>Total Hospitals</p>
            </div>
            <div className="report-box">
              <h4>{reports.approvedHospitals}</h4>
              <p>Approved Hospitals</p>
            </div>
            <div className="report-box">
              <h4>{reports.totalRequests}</h4>
              <p>Total Requests</p>
            </div>
            <div className="report-box">
              <h4>{reports.pendingRequests}</h4>
              <p>Pending</p>
            </div>
            <div className="report-box">
              <h4>{reports.acceptedRequests}</h4>
              <p>Accepted</p>
            </div>
            <div className="report-box">
              <h4>{reports.completedDonations}</h4>
              <p>Completed</p>
            </div>
          </div>
        ) : (
          <p>Loading reports...</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
