import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EmployeeForm from '../components/EmployeeForm';
import { getEmployee, updateEmployee } from '../api/employeeApi';
import { Employee, EmployeeRequest } from '../types/Employee';

export default function EditEmployeePage() {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | undefined>();
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string>('');
  const [submitError, setSubmitError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    getEmployee(Number(id))
      .then(setEmployee)
      .catch(() => setFetchError('Employee not found.'));
  }, [id]);

  const handleSubmit = async (data: EmployeeRequest) => {
    if (!id) return;
    try {
      setLoading(true);
      setSubmitError('');
      await updateEmployee(Number(id), data);
      navigate('/employees');
    } catch (e: any) {
      setSubmitError(e.response?.data?.message || 'Failed to update employee.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchError) return <div className="alert alert-error">{fetchError}</div>;
  if (!employee) return <p>Loading employee...</p>;

  return (
    <div className="page">
      <h1>Edit Employee</h1>
      <EmployeeForm
        initial={employee}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/employees')}
        loading={loading}
        error={submitError}
      />
    </div>
  );
}
