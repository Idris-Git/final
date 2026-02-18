import "../../styles/Hospital.css";

const HospitalDashboard = () => {
  return (
    <div>
      <h2>Hospital Dashboard</h2>

      <h3>Create Blood Request</h3>

      <form>
        <input type="text" placeholder="Patient Name" />
        <input type="number" placeholder="Patient Age" />
        <input type="text" placeholder="Blood Type" />

        <select>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <button type="submit">Create Request</button>
      </form>

      <hr />

      <h3>Requests Status</h3>
      <p>Request 1 - Pending</p>
      <p>Request 2 - Accepted</p>
    </div>
  );
};

export default HospitalDashboard;
