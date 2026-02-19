import "../../styles/Admin.css";

const AdminDashboard = () => {
  return (
    <div className="admin-d">
      <h2>Admin Dashboard</h2>

      <h3>Manage Users</h3>
      <div id="m-users"><p>Donor 1</p>
      <button>Remove</button>

      <p>Hospital 1</p>
      <button>Remove</button>
      </div>
      <br />
      <br />
      <hr />
      <h3>Reports</h3>
      <p>Total Donors: 20</p>
      <p>Total Requests: 15</p>
    </div>
  );
};

export default AdminDashboard;
