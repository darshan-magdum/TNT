import React from "react";
import { Link, Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      {/* Header with Company and Navigation */}
      <div
        style={{
          background: "#007bff",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 20px",
          fontFamily: "Segoe UI, sans-serif",
        }}
      >
        {/* Left: Company Name */}
        <div style={{ fontSize: "20px", fontWeight: "bold" }}>TNT INC</div>

        {/* Right: Navigation Links with Icons */}
        <nav>
          <Link
            to="/dashboard/driver"
            style={{ color: "#fff", textDecoration: "none", marginRight: "20px" }}
          >
            <i className="bi bi-person-fill" style={{ marginRight: "6px" }}></i>
            Driver Details
          </Link>

          <Link
            to="/dashboard/car"
            style={{ color: "#fff", textDecoration: "none", marginRight: "20px" }}
          >
            <i className="bi bi-car-front-fill" style={{ marginRight: "6px" }}></i>
            Car Details
          </Link>

          <Link
            to="/dashboard/analyze"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            <i className="bi bi-bar-chart-fill" style={{ marginRight: "6px" }}></i>
            Analyze
          </Link>
        </nav>
      </div>

      {/* Page Content */}
      <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
