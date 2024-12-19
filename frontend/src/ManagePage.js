import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageEmployee.css';

function ManageEmployee() {
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    employeeId: '',
    email: '',
    phone: '',
    department: '',
    dateOfJoining: '',
    role: '',
  });
  const [isEdit, setIsEdit] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/employees');
      setEmployees(response.data);
      setMessage('');
    } catch (error) {
      console.error('Error fetching employees:', error);
      setMessage('Failed to fetch employees.');
    }
  };

  const handleDelete = async (employeeId) => {
    try {
      await axios.delete(`http://localhost:5000/employees/${employeeId}`);
      setMessage('Employee deleted successfully!');
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      setMessage('Failed to delete employee.');
    }
  };

  const handleAddOrEdit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`http://localhost:5000/employees/${formData.employeeId}`, formData);
        setMessage('Employee updated successfully!');
      } else {
        await axios.post('http://localhost:5000/add-employee', formData);
        setMessage('Employee added successfully!');
      }
      fetchEmployees();
      handleReset();
      setFormVisible(false);
    } catch (error) {
      console.error('Error adding/editing employee:', error);
      setMessage('Failed to add or edit employee.');
    }
  };

  const handleEditClick = (employee) => {
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      employeeId: employee.employeeId,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      dateOfJoining: employee.dateOfJoining.split('T')[0],
      role: employee.role,
    });
    setIsEdit(true);
    setFormVisible(true);
  };

  const handleAddClick = () => {
    setIsEdit(false);
    setFormData({
      firstName: '',
      lastName: '',
      employeeId: '',
      email: '',
      phone: '',
      department: '',
      dateOfJoining: '',
      role: '',
    });
    setFormVisible(true);
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      employeeId: '',
      email: '',
      phone: '',
      department: '',
      dateOfJoining: '',
      role: '',
    });
    setIsEdit(false);
    setFormVisible(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmployeeId = (id) => /^[0-9]{4}[A-Z]{2}$/.test(id);

  return (
    <div className="manage-container">
      <h1 className="manage-title">Manage Employees</h1>
      {message && <p className="message">{message}</p>}

      {formVisible && (
        <div className="form-popup">
          <form className="employee-form" onSubmit={handleAddOrEdit}>
            <h2>{isEdit ? 'Edit Employee' : 'Add Employee'}</h2>

            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Employee ID:</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                required
                maxLength="6"
                pattern="^[0-9]{4}[A-Z]{2}$"
                title="Employee ID must be in the format 4 digits followed by 2 uppercase letters."
              />
              {!validateEmployeeId(formData.employeeId) && formData.employeeId && (
                <p className="error-message">Employee ID must be 4 digits followed by 2 capital letters</p>
              )}
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                pattern="\d{10}"
                title="Phone number must be 10 digits."
              />
            </div>

            <div className="form-group">
              <label>Department:</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Date of Joining:</label>
              <input
                type="date"
                name="dateOfJoining"
                value={formData.dateOfJoining}
                onChange={handleChange}
                required
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label>Role:</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              />
            </div>

            <button className="submit-button" type="submit">
              {isEdit ? 'Update' : 'Add'}
            </button>
            <button className="reset-button" type="button" onClick={handleReset}>
              Cancel
            </button>
          </form>
        </div>
      )}

      <button className="add-button" onClick={handleAddClick}>
        Add Employee
      </button>

      {employees.length > 0 ? (
        <table className="employee-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Employee ID</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Date of Joining</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.employeeId}>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{employee.employeeId}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td>{employee.department}</td>
                <td>{employee.dateOfJoining}</td>
                <td>{employee.role}</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => handleEditClick(employee)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(employee.employeeId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No employees found.</p>
      )}

      <button className="refresh-button" onClick={fetchEmployees}>
        Refresh List
      </button>
    </div>
  );
}

export default ManageEmployee;
