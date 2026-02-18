import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <h2>Blood Donation System</h2>

      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/donor">Donor</Link></li>
        <li><Link to="/hospital">Hospital</Link></li>
        <li><Link to="/admin">Admin</Link></li>
      </ul>

      <hr />
    </nav>
  );
};

export default Navbar;
