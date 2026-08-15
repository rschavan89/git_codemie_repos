import React, { useState, useEffect } from 'react';
import { Employee, EmployeeRequest } from '../types/Employee';

interface Props {
  initial?: Employee;
  onSubmit: (data: EmployeeRequest) => void;
  onCancel: () => void;
  loading?: boolean;
  error?: string;
}

const EMPTY: EmployeeRequest = { name: '', email: '', department: '', salary: 0 };

export default function EmployeeForm({ initial, onSubmit, onCancel, loading, error }: Props) {
  const [form, setForm] = useState<EmployeeRequest>(
    initial ? { name: initial.name, email: initial.email, department: initial.department, salary: initial.salary }
            : EMPTY
  );
  const [validationErrors, setValidationErrors] = useState<Partial<EmployeeRequest>>({});

  useEffect(() => {
    if (initial) {
      setForm({ name: initial.name, email: initial.email, department: initial.department, salary: initial.salary });
    }
  }, [initial]);

  const validate = (): boolean => {
    const errs: Partial<Record<keyof EmployeeRequest, string>> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Email must be valid';
    if (!form.department.trim()) errs.department = 'Department is required';
    if (!form.salary || form.salary <= 0) errs.salary = 'Salary must be positive' as any;
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'salary' ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} data-testid="employee-form">
      {error && <div className="alert alert-error" data-testid="form-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="name">Name *</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} data-testid="input-name" />
        {validationErrors.name && <span className="field-error">{validationErrors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} data-testid="input-email" />
        {validationErrors.email && <span className="field-error">{validationErrors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="department">Department *</label>
        <input id="department" name="department" value={form.department} onChange={handleChange} data-testid="input-department" />
        {validationErrors.department && <span className="field-error">{validationErrors.department}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="salary">Salary *</label>
        <input id="salary" name="salary" type="number" min="0" step="0.01" value={form.salary} onChange={handleChange} data-testid="input-salary" />
        {(validationErrors as any).salary && <span className="field-error">{(validationErrors as any).salary}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" disabled={loading} data-testid="btn-submit">
          {loading ? 'Saving...' : initial ? 'Update Employee' : 'Add Employee'}
        </button>
        <button type="button" onClick={onCancel} data-testid="btn-cancel">Cancel</button>
      </div>
    </form>
  );
}
