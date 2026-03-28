import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const savedRole = localStorage.getItem("role");
    if (!savedRole) {
      setLoading(false);
      return;
    }

    const meEndpoints = {
      donor: "/api/auth/me",
      hospital: "/api/hospital/me",
      admin: "/api/admin/me",
    };

    try {
      const res = await fetch(meEndpoints[savedRole]);
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setRole(savedRole);
      } else {
        localStorage.removeItem("role");
        setUser(null);
        setRole(null);
      }
    } catch {
      localStorage.removeItem("role");
      setUser(null);
      setRole(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userData, userRole) => {
    setUser(userData);
    setRole(userRole);
    localStorage.setItem("role", userRole);
  };

  const logout = async () => {
    const logoutEndpoints = {
      donor: "/api/auth/logout",
      hospital: "/api/hospital/logout",
      admin: "/api/admin/logout",
    };

    try {
      await fetch(logoutEndpoints[role], { method: "POST" });
    } catch {
      // ignore
    }

    setUser(null);
    setRole(null);
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
