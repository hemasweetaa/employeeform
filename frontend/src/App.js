import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Employee from "./AddEmployeeFormEmployee";
import ManageEmployee from "./ManagePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Employee />} />
        <Route path="/manage" element={<ManageEmployee />} />
      </Routes>
    </Router>
  );
}

export default App;
