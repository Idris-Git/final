import { Link } from "react-router-dom";
import "../styles/Navbar.css";
const Navbar = () => {
  return (
    <div id="navigation">
      <h2>Blood Donation System</h2>
      <nav id="linksnav">
        <ul >
          <li><Link to="/">Home</Link></li>
          <li>Profile</li>
          <li>Dashbord</li>
        </ul>
      </nav>
    </div>
    
  );
};

export default Navbar;
