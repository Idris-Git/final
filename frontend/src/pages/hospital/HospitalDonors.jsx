import { useState } from "react";
import "../../styles/Hospital.css";

const HospitalDonors = () => {
  const [donors, setDonors] = useState([]);
  const [filters, setFilters] = useState({ bloodType: "", address: "" });
  const [searched, setSearched] = useState(false);

  const bloodTypes = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const searchDonors = async (e) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      if (filters.bloodType) params.append("bloodType", filters.bloodType);
      if (filters.address) params.append("address", filters.address);

      const res = await fetch(`/api/hospital/donors?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setDonors(data);
        setSearched(true);
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Search Donors</h2>

        <form onSubmit={searchDonors}>
          <select
            value={filters.bloodType}
            onChange={(e) => setFilters({ ...filters, bloodType: e.target.value })}
          >
            {bloodTypes.map((bt) => (
              <option key={bt} value={bt}>{bt || "All Blood Types"}</option>
            ))}
          </select>
          <input
            placeholder="City / Location"
            value={filters.address}
            onChange={(e) => setFilters({ ...filters, address: e.target.value })}
          />
          <button type="submit" className="btn-full">Search</button>
        </form>

        <hr />

        {searched && donors.length === 0 && <p className="empty">No donors found</p>}

        {donors.map((donor) => (
          <div key={donor._id} className="request-item">
            <p><strong>Name:</strong> {donor.name}</p>
            <p><strong>Blood Type:</strong> {donor.bloodType}</p>
            <p><strong>Contact:</strong> {donor.contact}</p>
            <p><strong>Location:</strong> {donor.address}</p>
            <p><strong>Status:</strong> <span className={donor.active ? "text-green" : "text-red"}>
              {donor.active ? "Active" : "Inactive"}
            </span></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HospitalDonors;
