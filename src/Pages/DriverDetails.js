import React, { useState } from "react";

function DriverDetails() {
  const allDrivers = [
    { Name: "Mohan Singh", Mobile: "9876543210" },
    { Name: "Ravi Kumar", Mobile: "9123456780" },
    { Name: "Ajay Verma", Mobile: "8899776655" },
    { Name: "Suresh Pawar", Mobile: "9988776655" },
    { Name: "Imran Sheikh", Mobile: "9900112233" },
  ];

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 3;

  const filtered = allDrivers.filter((d) =>
    d.Name.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div style={{ padding: 20, fontFamily: "Segoe UI, sans-serif" }}>
      <h2 style={{ color: "#007bff" }}>👨‍✈️ Driver Details</h2>

      <input
        type="text"
        placeholder="Search by driver name"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        style={{
          padding: 8,
          marginBottom: 20,
          width: "100%",
          maxWidth: 300,
          borderRadius: 5,
          border: "1px solid #ccc",
        }}
      />

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #ccc",
            minWidth: "400px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#007bff", color: "#fff" }}>
              <th style={thStyle}>SR No</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Mobile</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: 20, color: "#888", border: "1px solid #ccc" }}>
                  No driver details found.
                </td>
              </tr>
            ) : (
              paginated.map((driver, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "#ffffff" }}>
                  <td style={tdStyle}>{(page - 1) * perPage + i + 1}</td>
                  <td style={tdStyle}>{driver.Name}</td>
                  <td style={tdStyle}>{driver.Mobile}</td>
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
              borderRadius: 4,
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

const thStyle = {
  padding: "12px",
  textAlign: "left",
  border: "1px solid #ccc",
};

const tdStyle = {
  padding: "10px",
  border: "1px solid #ccc",
};

export default DriverDetails;
