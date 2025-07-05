import React, { useState } from "react";
import * as XLSX from "xlsx";

function DutySlipAnalyzer() {
  const allSlips = [
    {
      slipNo: "DS001",
      company: "TNT Inc",
      bookedBy: "Raj",
      passenger: "Amit",
      pickup: "Mumbai",
      type: "SUV",
      regNo: "MH12AB1234",
      tripType: "Outstation",
      driver: "Karan",
      startKm: 12000,
      closeKm: 12310,
      totalKm: 310,
      extraKm: 10,
      startTime: "08:00 AM",
      closeTime: "08:00 PM",
      totalHours: 12,
      extraHours: 2,
      startDate: "2025-07-01",
      closeDate: "2025-07-01",
      totalDays: 1,
      tollParking: 200,
    },
    {
      slipNo: "DS002",
      company: "TNT Inc",
      bookedBy: "Sneha",
      passenger: "Rahul",
      pickup: "Pune",
      type: "Sedan",
      regNo: "MH14XY9876",
      tripType: "Local",
      driver: "Arjun",
      startKm: 5000,
      closeKm: 5150,
      totalKm: 150,
      extraKm: 0,
      startTime: "09:00 AM",
      closeTime: "01:00 PM",
      totalHours: 4,
      extraHours: 0,
      startDate: "2025-07-02",
      closeDate: "2025-07-02",
      totalDays: 1,
      tollParking: 50,
    },
    {
      slipNo: "DS003",
      company: "TNT Inc",
      bookedBy: "Ankit",
      passenger: "Priya",
      pickup: "Nashik",
      type: "MPV",
      regNo: "MH13LM3344",
      tripType: "Outstation",
      driver: "Ravi",
      startKm: 3000,
      closeKm: 3350,
      totalKm: 350,
      extraKm: 20,
      startTime: "07:30 AM",
      closeTime: "09:00 PM",
      totalHours: 13.5,
      extraHours: 3.5,
      startDate: "2025-07-03",
      closeDate: "2025-07-03",
      totalDays: 1,
      tollParking: 150,
    }
  ];

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 2;

  const filteredSlips = allSlips.filter(
    (slip) =>
      slip.slipNo.toLowerCase().includes(search.toLowerCase()) ||
      slip.company.toLowerCase().includes(search.toLowerCase()) ||
      slip.passenger.toLowerCase().includes(search.toLowerCase()) ||
      slip.bookedBy.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedSlips = filteredSlips.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filteredSlips.length / perPage);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredSlips);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DutySlips");
    XLSX.writeFile(workbook, "DutySlips.xlsx");
  };

  const thStyle = {
    padding: "10px",
    border: "1px solid #ccc",
    backgroundColor: "#007bff",
    color: "white",
    textAlign: "left",
  };

  const tdStyle = {
    padding: "10px",
    border: "1px solid #ccc",
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Segoe UI" }}>
      <h2 style={{ color: "#007bff" }}>📝 Duty Slip Analyzer</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <button
          style={{
            padding: "8px 15px",
            backgroundColor: "#6c757d",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          📄 Upload Document
        </button>

        <input
          type="text"
          placeholder="Search by slip no, company, passenger"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{
            padding: "8px",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={exportToExcel}
          style={{
            padding: "8px 15px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Export to Excel
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            borderCollapse: "collapse",
            minWidth: "1300px",
            width: "100%",
            border: "1px solid #ccc",
          }}
        >
          <thead>
            <tr>
              {[
                "SR No", "Duty Slip No", "Company", "Booked By", "Passenger Name", "Pickup Address",
                "Type of Vehicle", "Vehicle Reg. No", "Trip Type", "Driver Name", "Start KM",
                "Close KM", "Total KM", "Extra KM", "Start Time", "Close Time", "Total Hours",
                "Extra Hours", "Start Date", "Close Date", "Total Days", "Toll/Parking (₹)"
              ].map((heading, i) => (
                <th key={i} style={thStyle}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedSlips.length === 0 ? (
              <tr>
                <td colSpan="22" style={{ textAlign: "center", padding: "15px", color: "#888" }}>
                  No details found.
                </td>
              </tr>
            ) : (
              paginatedSlips.map((slip, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "#ffffff" }}>
                  <td style={tdStyle}>{(page - 1) * perPage + i + 1}</td>
                  <td style={tdStyle}>{slip.slipNo}</td>
                  <td style={tdStyle}>{slip.company}</td>
                  <td style={tdStyle}>{slip.bookedBy}</td>
                  <td style={tdStyle}>{slip.passenger}</td>
                  <td style={tdStyle}>{slip.pickup}</td>
                  <td style={tdStyle}>{slip.type}</td>
                  <td style={tdStyle}>{slip.regNo}</td>
                  <td style={tdStyle}>{slip.tripType}</td>
                  <td style={tdStyle}>{slip.driver}</td>
                  <td style={tdStyle}>{slip.startKm}</td>
                  <td style={tdStyle}>{slip.closeKm}</td>
                  <td style={tdStyle}>{slip.totalKm}</td>
                  <td style={tdStyle}>{slip.extraKm}</td>
                  <td style={tdStyle}>{slip.startTime}</td>
                  <td style={tdStyle}>{slip.closeTime}</td>
                  <td style={tdStyle}>{slip.totalHours}</td>
                  <td style={tdStyle}>{slip.extraHours}</td>
                  <td style={tdStyle}>{slip.startDate}</td>
                  <td style={tdStyle}>{slip.closeDate}</td>
                  <td style={tdStyle}>{slip.totalDays}</td>
                  <td style={tdStyle}>{slip.tollParking}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 15, textAlign: "center" }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            style={{
              margin: "0 5px",
              padding: "6px 12px",
              background: page === i + 1 ? "#007bff" : "#f0f0f0",
              color: page === i + 1 ? "#fff" : "#000",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default DutySlipAnalyzer;
