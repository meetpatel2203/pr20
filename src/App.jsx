import React, { useState, useEffect } from "react";
import EmployeeForm from "./EmployeeForm";
import EmployeeList from "./EmployeeList";

function App() {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Read: Fetch employee data from dummy API
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }
        return response.json();
      })
      .then((data) => {
        const formattedData = data.map((item) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          department: item.company.name,
          salary: 30000,
        }));

        setEmployees(formattedData);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load employees. Please try again.");
        setLoading(false);
      });
  }, []);

  // Create or Update employee
  const handleSave = (employeeData) => {
    if (editingEmployee) {
      setEmployees((previous) =>
        previous.map((employee) =>
          employee.id === editingEmployee.id
            ? { ...employee, ...employeeData }
            : employee
        )
      );
      setEditingEmployee(null);
    } else {
      const newEmployee = {
        ...employeeData,
        id: Date.now(),
      };

      setEmployees((previous) => [
        ...previous,
        newEmployee,
      ]);
    }
  };

  // Delete employee
  const handleDelete = (id) => {
    setEmployees((previous) =>
      previous.filter((employee) => employee.id !== id)
    );

    if (editingEmployee?.id === id) {
      setEditingEmployee(null);
    }
  };

  // Select employee for editing
  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container">
      <h1>Employee Management System</h1>
      <p className="subtitle">
        Manage employee records using React CRUD operations
      </p>

      <EmployeeForm
        onSave={handleSave}
        editingEmployee={editingEmployee}
        onCancel={() => setEditingEmployee(null)}
      />

      <h2>Employee List</h2>

      {loading ? (
        <p className="message">Loading employees...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <EmployeeList
          employees={employees}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default App;