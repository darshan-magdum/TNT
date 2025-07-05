import React, { useState } from "react";

function CarDetails() {
  const allCars = [
    { Name: "Toyota Crysta", Type: "SUV", Number: "MH12AB1234", Color: "White", Rate: "₹17/km" },
    { Name: "Hyundai Verna", Type: "Sedan", Number: "DL01CD5678", Color: "Silver", Rate: "₹15/km" },
    { Name: "Maruti Ertiga", Type: "MPV", Number: "KA05XY1111", Color: "Blue", Rate: "₹16/km" },
    { Name: "Honda City", Type: "Sedan", Number: "MH14DE4321", Color: "Black", Rate: "₹14/km" },
    { Name: "Innova HyCross", Type: "SUV", Number: "GJ01RT8765", Color: "Red", Rate: "₹18/km" },
  ];

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 3;

  const filtered = allCars.filter((car) =>
    car.Name.toLowerCase().includes(search.toLowerCase()) ||
    car.Number.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div style={{ padding: 20, fontFamily: "Segoe UI, sans-serif" }}>
      <h2 style={{ color: "#007bff" }}>🚘 Car Details</h2>

      <input
        type="text"
        placeholder="Search by car name or number"
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
            minWidth: "500px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#007bff", color: "#fff" }}>
              <th style={thStyle}>SR No</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Number</th>
              <th style={thStyle}>Color</th>
              <th style={thStyle}>Rate</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: 20, color: "#888", border: "1px solid #ccc" }}>
                  No car details available.
                </td>
              </tr>
            ) : (
              paginated.map((car, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "#ffffff" }}>
                  <td style={tdStyle}>{(page - 1) * perPage + i + 1}</td>
                  <td style={tdStyle}>{car.Name}</td>
                  <td style={tdStyle}>{car.Type}</td>
                  <td style={tdStyle}>{car.Number}</td>
                  <td style={tdStyle}>{car.Color}</td>
                  <td style={tdStyle}>{car.Rate}</td>
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

export default CarDetails;
