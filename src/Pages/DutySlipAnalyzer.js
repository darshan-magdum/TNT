import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import "./DutySlipAnalyzer.css";

function DutySlipAnalyzer() {
  const [slips, setSlips] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingCell, setEditingCell] = useState({ rowIndex: null, key: null });
  const [editIndex, setEditIndex] = useState(null);

  const perPage = 5;
  const fileInputRef = useRef();

  const endpoint = "https://dutyslipextraction.cognitiveservices.azure.com/";
  const apiKey = "CGnyHUbguN1Qy3jOZD2yTnrnNy1A2x0LJBYdWXVRDNUd7N8txrRwJQQJ99BGACYeBjFXJ3w3AAALACOGF8ww";
  const modelId = "TNTmodelNew";

  const handleFileUpload = async (e, reuploadIndex = null) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setLoading(true);
    const newSlips = [...slips];

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      try {
        const contentType = file.type || "application/octet-stream";
        const analyzeUrl = `${endpoint}formrecognizer/documentModels/${modelId}:analyze?api-version=2023-07-31`;

        const uploadResponse = await fetch(analyzeUrl, {
          method: "POST",
          headers: {
            "Content-Type": contentType,
            "Ocp-Apim-Subscription-Key": apiKey,
          },
          body: file,
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error("Azure Upload Error:", errorText);
          throw new Error(`Upload failed: ${uploadResponse.status}`);
        }

        const operationLocation = uploadResponse.headers.get("operation-location");
        if (!operationLocation) throw new Error("No operation-location header returned.");

        let result;
        while (true) {
          const poll = await fetch(operationLocation, {
            headers: { "Ocp-Apim-Subscription-Key": apiKey },
          });
          result = await poll.json();
          if (result.status === "succeeded") break;
          if (result.status === "failed") throw new Error("Azure failed to analyze document.");
          await new Promise((res) => setTimeout(res, 2000));
        }

        const fields = result?.analyzeResult?.documents?.[0]?.fields || {};

        const parsed = {
          slipNo: fields["Duty slip No"]?.content || "",
          company: fields["Company"]?.content || "",
          bookedBy: fields["Booked by"]?.content || "",
          passenger: fields["Passenger Name"]?.content || "",
          pickup: fields["pickup address"]?.content || "",
          type: fields["Type of veh"]?.content || "",
          regNo: fields["veh Regn no"]?.content || "",
          tripType: fields["trip"]?.content || "",
          driver: fields["Driver name"]?.content || "",
          startKm: fields["starting km"]?.content || "",
          closeKm: fields["closing km"]?.content || "",
          totalKm: fields["total km"]?.content || "",
          extraKm: fields["extra km"]?.content || "",
          startTime: fields["starting time"]?.content || "",
          closeTime: fields["closing time"]?.content || "",
          totalHours: fields["total time"]?.content || "",
          extraHours: fields["extra time"]?.content || "",
          startDate: fields["starting date"]?.content || "",
          closeDate: fields["closing date"]?.content || "",
          totalDays: fields["total days"]?.content || "",
          tollParking: fields["toll/parking extra"]?.content || "",
        };

        if (reuploadIndex !== null && files.length === 1) {
          newSlips[reuploadIndex] = parsed;
        } else {
          newSlips.push(parsed);
        }
      } catch (err) {
        console.error("❌ Error analyzing document:", err);
        alert(`Error analyzing file ${file.name}`);
      }
    }

    setSlips(newSlips);
    setEditIndex(null);
    setLoading(false);
  };

  const handleDelete = (index) => {
    const globalIndex = (page - 1) * perPage + index;
    const updated = slips.filter((_, i) => i !== globalIndex);
    setSlips(updated);
  };

  const filteredSlips = slips.filter(
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

  const renderEditableCell = (i, key) => {
    const globalIndex = (page - 1) * perPage + i;
    return (
      <td
        className="editable-cell"
        onClick={() => setEditingCell({ rowIndex: i, key })}
      >
        {editingCell.rowIndex === i && editingCell.key === key ? (
          <input
            type="text"
            value={slips[globalIndex][key]}
            autoFocus
            onChange={(e) => {
              const newSlips = [...slips];
              newSlips[globalIndex][key] = e.target.value;
              setSlips(newSlips);
            }}
            onBlur={() => setEditingCell({ rowIndex: null, key: null })}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setEditingCell({ rowIndex: null, key: null });
              }
            }}
            className="cell-input"
          />
        ) : (
          slips[globalIndex][key] || "-"
        )}
      </td>
    );
  };

  return (
    <div className="container">
      <h2 className="title">📝 Duty Slip Analyzer</h2>

      <div className="top-bar">
        <button
          className="upload-btn"
          onClick={() => {
            setEditIndex(null);
            fileInputRef.current.click();
          }}
        >
          📄 Upload Document
        </button>

        <input
          type="file"
          accept=".pdf,.jpg,.png"
          ref={fileInputRef}
          onChange={(e) => handleFileUpload(e, editIndex)}
          multiple
          style={{ display: "none" }}
        />

        <input
          type="text"
          className="search-box"
          placeholder="Search by slip no, company, passenger"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <button className="export-btn" onClick={exportToExcel}>
          Export to Excel
        </button>
      </div>

  

      {loading && (
  <div className="overlay">
    <div className="overlay-message">Analyzing document, please wait...</div>
  </div>
)}


      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {["SR No", "Duty Slip No", "Company", "Booked By", "Passenger Name",
                "Pickup Address", "Type of Vehicle", "Vehicle Reg. No", "Trip Type",
                "Driver Name", "Start KM", "Close KM", "Total KM", "Extra KM",
                "Start Time", "Close Time", "Total Hours", "Extra Hours",
                "Start Date", "Close Date", "Total Days", "Toll/Parking (₹)", "Actions"
              ].map((heading, i) => (
                <th key={i} className="table-header">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedSlips.length === 0 ? (
              <tr>
                <td colSpan="23" className="no-data">No details found.</td>
              </tr>
            ) : (
              paginatedSlips.map((slip, i) => (
                <tr key={i} className={i % 2 === 0 ? "even-row" : "odd-row"}>
                  <td className="editable-cell">{(page - 1) * perPage + i + 1}</td>
                  {renderEditableCell(i, "slipNo")}
                  {renderEditableCell(i, "company")}
                  {renderEditableCell(i, "bookedBy")}
                  {renderEditableCell(i, "passenger")}
                  {renderEditableCell(i, "pickup")}
                  {renderEditableCell(i, "type")}
                  {renderEditableCell(i, "regNo")}
                  {renderEditableCell(i, "tripType")}
                  {renderEditableCell(i, "driver")}
                  {renderEditableCell(i, "startKm")}
                  {renderEditableCell(i, "closeKm")}
                  {renderEditableCell(i, "totalKm")}
                  {renderEditableCell(i, "extraKm")}
                  {renderEditableCell(i, "startTime")}
                  {renderEditableCell(i, "closeTime")}
                  {renderEditableCell(i, "totalHours")}
                  {renderEditableCell(i, "extraHours")}
                  {renderEditableCell(i, "startDate")}
                  {renderEditableCell(i, "closeDate")}
                  {renderEditableCell(i, "totalDays")}
                  {renderEditableCell(i, "tollParking")}
                  <td className="editable-cell action-cell">
                    <button className="delete-btn" onClick={() => handleDelete(i)}>Delete</button>
                    <button
                      className="reupload-btn"
                      onClick={() => {
                        setEditIndex((page - 1) * perPage + i);
                        fileInputRef.current.click();
                      }}
                    >
                      Re-upload
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`page-btn ${page === i + 1 ? "active" : ""}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default DutySlipAnalyzer;
