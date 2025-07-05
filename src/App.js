import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IntroPage from "./Pages/IntroPage";
import Dashboard from "./Pages/Dashboard";
import DriverDetails from "./Pages/DriverDetails";
import CarDetails from "./Pages/CarDetails";
import DutySlipAnalyzer from "./Pages/DutySlipAnalyzer";

function App() {
  return (
    <Router>
      <Routes>
        {/* Intro */}
        <Route path="/" element={<IntroPage />} />

        {/* Dashboard with Layout */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="driver" element={<DriverDetails />} />
          <Route path="car" element={<CarDetails />} />
          <Route path="analyze" element={<DutySlipAnalyzer />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
