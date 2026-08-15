import axios from 'axios';
import { Employee, EmployeeRequest } from '../types/Employee';

const BASE = '/api/v1/employees';

export const listEmployees = (): Promise<Employee[]> =>
  axios.get<Employee[]>(BASE).then(r => r.data);

export const getEmployee = (id: number): Promise<Employee> =>
  axios.get<Employee>(`${BASE}/${id}`).then(r => r.data);

export const createEmployee = (data: EmployeeRequest): Promise<Employee> =>
  axios.post<Employee>(BASE, data).then(r => r.data);

export const updateEmployee = (id: number, data: EmployeeRequest): Promise<Employee> =>
  axios.put<Employee>(`${BASE}/${id}`, data).then(r => r.data);

export const deleteEmployee = (id: number): Promise<void> =>
  axios.delete(`${BASE}/${id}`).then(() => {});
