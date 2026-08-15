export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  salary: number;
}

export interface EmployeeRequest {
  name: string;
  email: string;
  department: string;
  salary: number;
}
