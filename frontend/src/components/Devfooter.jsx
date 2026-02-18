import { Link } from "react-router-dom";

const Devfooter = () => {
  return (
    <nav>
      <hr />
      <h2>go between pages for devs</h2>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/donor">Donor</Link></li>
        <li><Link to="/hospital">Hospital</Link></li>
        <li><Link to="/admin">Admin</Link></li>
      </ul>
    </nav>
  );
};

export default Devfooter;
