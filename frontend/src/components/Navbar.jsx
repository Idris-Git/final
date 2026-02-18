import { Link } from "react-router-dom";
import "../styles/Navbar.css";
const Navbar = () => {
  return (
    <nav>
      <h2>Blood Donation System</h2>

      <ul>
        <li><Link to="/">Home</Link></li>
        <li>Profile</li>
        <li>Dashbord</li>
      </ul>

      <hr />
    </nav>
  );
};

export default Navbar;
