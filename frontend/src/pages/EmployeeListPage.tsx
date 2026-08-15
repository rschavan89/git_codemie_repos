import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeTable from '../components/EmployeeTable';
import { listEmployees, deleteEmployee } from '../api/employeeApi';
import { Employee } from '../types/Employee';

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await listEmployees();
      setEmployees(data);
    } catch {
      setError('Failed to load employees.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this employee?')) return;
    try {
      await deleteEmployee(id);
      setEmployees(prev => prev.filter(e => e.id !== id));
    } catch {
      setError('Failed to delete employee.');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Employee Management</h1>
        <button onClick={() => navigate('/employees/new')} data-testid="btn-add-employee">
          Add Employee
        </button>
      </div>

      {error && <div className="alert alert-error" data-testid="list-error">{error}</div>}

      {loading ? (
        <p data-testid="loading">Loading...</p>
      ) : (
        <EmployeeTable
          employees={employees}
          onEdit={emp => navigate(`/employees/${emp.id}/edit`)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
