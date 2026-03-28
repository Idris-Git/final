import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import DonorSignup from "./pages/DonorSignup";
import HospitalSignup from "./pages/HospitalSignup";

import DonorDashboard from "./pages/donor/DonorDashboard";
import DonorHistory from "./pages/donor/DonorHistory";
import DonorSettings from "./pages/donor/DonorSettings";

import HospitalDashboard from "./pages/hospital/HospitalDashboard";
import HospitalDonors from "./pages/hospital/HospitalDonors";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHospitals from "./pages/admin/AdminHospitals";
import AdminDonors from "./pages/admin/AdminDonors";
import AdminRequests from "./pages/admin/AdminRequests";
import AdminPosts from "./pages/admin/AdminPosts";

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="page"><p>Loading...</p></div>;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup/donor" element={user ? <Navigate to="/" /> : <DonorSignup />} />
        <Route path="/signup/hospital" element={user ? <Navigate to="/" /> : <HospitalSignup />} />

        {/* Donor routes */}
        <Route path="/donor" element={<ProtectedRoute allowedRoles={["donor"]}><DonorDashboard /></ProtectedRoute>} />
        <Route path="/donor/history" element={<ProtectedRoute allowedRoles={["donor"]}><DonorHistory /></ProtectedRoute>} />
        <Route path="/donor/settings" element={<ProtectedRoute allowedRoles={["donor"]}><DonorSettings /></ProtectedRoute>} />

        {/* Hospital routes */}
        <Route path="/hospital" element={<ProtectedRoute allowedRoles={["hospital"]}><HospitalDashboard /></ProtectedRoute>} />
        <Route path="/hospital/donors" element={<ProtectedRoute allowedRoles={["hospital"]}><HospitalDonors /></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/hospitals" element={<ProtectedRoute allowedRoles={["admin"]}><AdminHospitals /></ProtectedRoute>} />
        <Route path="/admin/donors" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDonors /></ProtectedRoute>} />
        <Route path="/admin/requests" element={<ProtectedRoute allowedRoles={["admin"]}><AdminRequests /></ProtectedRoute>} />
        <Route path="/admin/posts" element={<ProtectedRoute allowedRoles={["admin"]}><AdminPosts /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
