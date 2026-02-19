import { useState } from "react";
import "../../styles/Donor.css";
const DonorDashboard = () => {
  const [active, setActive] = useState(true);

  const requests = [
    { id: 1, patient: "Ali", bloodType: "O+", emergency: "High" },
    { id: 2, patient: "Sara", bloodType: "A+", emergency: "Medium" }
  ];

  return (
    <div className="d-dash">
      <h2>Donor Dashboard</h2>

      <p>Status: {active ? "Active" : "Inactive"}</p>
      <button onClick={() => setActive(!active)}>
        Change Status
      </button>
      <br /> <br />
      <h3>Blood Requests</h3>
      <br />
      {requests.map((req) => (
        <div key={req.id}>
          <p>Patient: {req.patient}</p>
          <p>Blood Type: {req.bloodType}</p>
          <p>Emergency: {req.emergency}</p>
          <button>Accept</button>
          <hr />
          <br />
        </div>
      ))}
    </div>
  );
};

export default DonorDashboard;
