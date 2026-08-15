import React from 'react';
import { Employee } from '../types/Employee';

interface Props {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => void;
}

export default function EmployeeTable({ employees, onEdit, onDelete }: Props) {
  if (employees.length === 0) {
    return <p data-testid="no-employees">No employees found.</p>;
  }

  return (
    <table data-testid="employee-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Department</th>
          <th>Salary</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees.map(emp => (
          <tr key={emp.id} data-testid={`employee-row-${emp.id}`}>
            <td>{emp.id}</td>
            <td>{emp.name}</td>
            <td>{emp.email}</td>
            <td>{emp.department}</td>
            <td>{emp.salary.toLocaleString()}</td>
            <td>
              <button onClick={() => onEdit(emp)} data-testid={`btn-edit-${emp.id}`}>Edit</button>
              <button onClick={() => onDelete(emp.id)} data-testid={`btn-delete-${emp.id}`}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
