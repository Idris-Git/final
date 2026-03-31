import { useState, useEffect } from "react";
import "../../styles/Donor.css";

const DonorNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/donor/notifications");
      const data = await res.json();
      if (res.ok) setNotifications(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchNotifications();
    markAllRead();
  }, []);

  const markAllRead = async () => {
    try {
      await fetch("/api/donor/notifications/read-all", { method: "PUT" });
    } catch {
      // ignore
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Notifications</h2>

        {notifications.length === 0 ? (
          <p className="empty">No notifications</p>
        ) : (
          notifications.map((n) => (
            <div key={n._id} className={`request-item ${!n.read ? "notif-unread" : ""}`}>
              <p className="notif-msg">{n.message}</p>
              {n.bloodRequestId && (
                <div className="notif-details">
                  <p><strong>Patient:</strong> {n.bloodRequestId.patientName}</p>
                  <p><strong>Blood Type:</strong> {n.bloodRequestId.bloodType}</p>
                  <p>
                    <strong>Emergency:</strong>{" "}
                    <span className={`emergency-${n.bloodRequestId.emergencyLevel.toLowerCase()}`}>
                      {n.bloodRequestId.emergencyLevel}
                    </span>
                  </p>
                  <p><strong>Units:</strong> {n.bloodRequestId.requiredUnits}</p>
                  <p><strong>Status:</strong>{" "}
                    <span className={`status-${n.bloodRequestId.status.toLowerCase()}`}>
                      {n.bloodRequestId.status}
                    </span>
                  </p>
                </div>
              )}
              <p className="date">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DonorNotifications;
