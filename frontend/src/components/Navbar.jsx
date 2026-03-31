import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/Waridak.png";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user && role === "donor") {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user, role]);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch("/api/donor/notifications/unread-count");
      const data = await res.json();
      if (res.ok) setUnreadCount(data.count);
    } catch {
      // ignore
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div id="navigation">
      <nav>
        <ul>
          <li id="logoAndname">
            <img id="logo" src={logo} alt="Waridak Logo" />
            <h2>Waridak</h2></li>
          <li id="linksnav"><Link to="/">Home</Link></li>

          {!user && (
            <li id="linksnav"><Link to="/login">Login</Link></li>
          )}

          {user && role === "donor" && (
            <>
              <li id="linksnav"><Link to="/donor">Dashboard</Link></li>
              <li id="linksnav">
                <Link to="/donor/notifications" className="notif-link">
                  Notifications
                  {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                </Link>
              </li>
              <li id="linksnav"><Link to="/donor/history">History</Link></li>
              <li id="linksnav"><Link to="/donor/settings">Settings</Link></li>
            </>
          )}

          {user && role === "hospital" && (
            <>
              <li id="linksnav"><Link to="/hospital">Dashboard</Link></li>
              <li id="linksnav"><Link to="/hospital/donors">Search Donors</Link></li>
            </>
          )}

          {user && role === "admin" && (
            <>
              <li id="linksnav"><Link to="/admin">Dashboard</Link></li>
              <li id="linksnav"><Link to="/admin/hospitals">Hospitals</Link></li>
              <li id="linksnav"><Link to="/admin/donors">Donors</Link></li>
              <li id="linksnav"><Link to="/admin/requests">Requests</Link></li>
              <li id="linksnav"><Link to="/admin/posts">Posts</Link></li>
            </>
          )}

          {user && (
            <li id="linksnav">
              <a onClick={handleLogout} style={{ cursor: "pointer" }}>Logout</a>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
