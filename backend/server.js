const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post("/add-employee", async (req, res) => {
  const {
    firstName,
    lastName,
    employeeId,
    email,
    phone,
    department,
    dateOfJoining,
    role,
  } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO Employees (firstName, lastName, employeeId, email, phone, department, dateOfJoining, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [firstName, lastName, employeeId, email, phone, department, dateOfJoining, role]
    );

    res.status(200).json({ message: "Employee added successfully!" });
  } catch (error) {
    console.error("Error adding employee:", error);

    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ error: "Employee ID or email already exists." });
    } else {
      res.status(500).json({ error: "Failed to add employee." });
    }
  }
});

app.get("/employees", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Employees");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Failed to fetch employees." });
  }
});

app.delete("/employees/:employeeId", async (req, res) => {
  const { employeeId } = req.params;

  try {
    const [result] = await db.query("DELETE FROM Employees WHERE employeeId = ?", [employeeId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Employee not found." });
    }
    res.status(200).json({ message: "Employee deleted successfully!" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: "Failed to delete employee." });
  }
});

app.put("/employees/:employeeId", async (req, res) => {
  const { employeeId } = req.params;
  const updatedData = req.body;

  try {
    const [result] = await db.query(
      "UPDATE Employees SET ? WHERE employeeId = ?",
      [updatedData, employeeId]
    );
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Employee updated successfully!" });
    } else {
      res.status(404).json({ error: "Employee not found." });
    }
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ error: "Failed to update employee." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
