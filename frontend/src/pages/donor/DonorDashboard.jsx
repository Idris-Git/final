import { useState } from "react";
import "../../styles/Donor.css";
const DonorDashboard = () => {
  const [active, setActive] = useState(true);

  const requests = [
    { id: 1, patient: "Ali", bloodType: "O+", emergency: "High" },
    { id: 2, patient: "Sara", bloodType: "A+", emergency: "Medium" }
  ];

  return (
    <div>
      <h2>Donor Dashboard</h2>

      <p>Status: {active ? "Active" : "Inactive"}</p>
      <button onClick={() => setActive(!active)}>
        Change Status
      </button>

      <h3>Blood Requests</h3>

      {requests.map((req) => (
        <div key={req.id}>
          <p>Patient: {req.patient}</p>
          <p>Blood Type: {req.bloodType}</p>
          <p>Emergency: {req.emergency}</p>
          <button>Accept</button>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default DonorDashboard;
