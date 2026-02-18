import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

import Home from "./pages/Home.jsx";
import DonorDashboard from "./pages/donor/DonorDashboard.jsx";
import DonorProfile from "./pages/donor/DonorProfile.jsx";
import HospitalDashboard from "./pages/hospital/HospitalDashboard.jsx";
import HospitalProfile from "./pages/hospital/HospitalProfile.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProfile from "./pages/admin/AdminProfile.jsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/donor" element={<DonorDashboard />} />
        <Route path="/donor/profile" element={<DonorProfile />} />

        <Route path="/hospital" element={<HospitalDashboard />} />
        <Route path="/hospital/profile" element={<HospitalProfile />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
