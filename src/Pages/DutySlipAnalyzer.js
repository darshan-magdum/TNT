import React, { useState ,useRef  } from "react";
import * as XLSX from "xlsx";

function DutySlipAnalyzer() {
  const [slips, setSlips] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 2;
  const [loading, setLoading] = useState(false);

  const endpoint = "https://dutyslipextraction.cognitiveservices.azure.com/";
  const apiKey = "CGnyHUbguN1Qy3jOZD2yTnrnNy1A2x0LJBYdWXVRDNUd7N8txrRwJQQJ99BGACYeBjFXJ3w3AAALACOGF8ww";
  const modelId = "TNTmodel"; // Replace with your trained model ID


  const fileInputRef = useRef();
const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setLoading(true);

  try {
    const contentType = file.type || "application/octet-stream"; // Fallback
    console.log("Uploading file:", file.name, contentType, file.size);

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

    if (!operationLocation) {
      throw new Error("No operation-location header returned from Azure.");
    }

    let result;
    while (true) {
      const poll = await fetch(operationLocation, {
        headers: { "Ocp-Apim-Subscription-Key": apiKey },
      });
      result = await poll.json();

      if (result.status === "succeeded") break;
      if (result.status === "failed") {
        console.error("Azure processing failed:", result);
        throw new Error("Azure failed to analyze document.");
      }

      await new Promise((res) => setTimeout(res, 2000)); // wait 2s
    }

    const fields = result?.analyzeResult?.documents?.[0]?.fields || {};
    const parsed = {
      slipNo: fields.slipNo?.content || "DS" + (slips.length + 1).toString().padStart(3, "0"),
      company: fields.company?.content || "",
      bookedBy: fields.bookedBy?.content || "",
      passenger: fields.passenger?.content || "",
      pickup: fields.pickup?.content || "",
      type: fields.type?.content || "",
      regNo: fields.regNo?.content || "",
      tripType: fields.tripType?.content || "",
      driver: fields.driver?.content || "",
      startKm: fields.startKm?.content || "",
      closeKm: fields.closeKm?.content || "",
      totalKm: fields.totalKm?.content || "",
      extraKm: fields.extraKm?.content || "",
      startTime: fields.startTime?.content || "",
      closeTime: fields.closeTime?.content || "",
      totalHours: fields.totalHours?.content || "",
      extraHours: fields.extraHours?.content || "",
      startDate: fields.startDate?.content || "",
      closeDate: fields.closeDate?.content || "",
      totalDays: fields.totalDays?.content || "",
      tollParking: fields.tollParking?.content || "",
    };

    setSlips((prev) => [...prev, parsed]);
  } catch (err) {
    alert("❌ Failed to analyze document. Check console for details.");
    console.error("Document Analysis Error:", err);
  } finally {
    setLoading(false);
  }
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
  onClick={() => fileInputRef.current.click()}
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
  type="file"
  accept=".pdf,.jpg,.png"
  ref={fileInputRef}
  onChange={handleFileUpload}
  style={{ display: "none" }}
/>


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

      {loading && <p style={{ color: "orange" }}>Analyzing document, please wait...</p>}

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
                <th key={i} style={thStyle}>{heading}</th>
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
