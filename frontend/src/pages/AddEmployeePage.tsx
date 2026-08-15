import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeForm from '../components/EmployeeForm';
import { createEmployee } from '../api/employeeApi';
import { EmployeeRequest } from '../types/Employee';

export default function AddEmployeePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (data: EmployeeRequest) => {
    try {
      setLoading(true);
      setError('');
      await createEmployee(data);
      navigate('/employees');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to create employee.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Add Employee</h1>
      <EmployeeForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/employees')}
        loading={loading}
        error={error}
      />
    </div>
  );
}
