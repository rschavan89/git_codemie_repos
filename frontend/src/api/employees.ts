export type Employee = {
  id?: number
  name: string
  email: string
  department?: string
  salary?: number
}

export type ApiValidationError = {
  error: 'VALIDATION_ERROR'
  fieldErrors: Record<string, string>
}

export type ApiNotFoundError = {
  error: 'NOT_FOUND'
  message: string
}

async function parseJsonSafe(res: Response) {
  const text = await res.text()
  try {
    return text ? JSON.parse(text) : null
  } catch {
    return null
  }
}

export async function listEmployees(): Promise<Employee[]> {
  const res = await fetch('/api/employees')
  if (!res.ok) throw new Error(`Failed to list employees (${res.status})`)
  return res.json()
}

export async function getEmployee(id: number): Promise<Employee> {
  const res = await fetch(`/api/employees/${id}`)
  const json = await parseJsonSafe(res)
  if (res.status === 404) throw json as ApiNotFoundError
  if (!res.ok) throw new Error(`Failed to get employee (${res.status})`)
  return json as Employee
}

export async function createEmployee(emp: Employee): Promise<Employee> {
  const res = await fetch('/api/employees', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(emp)
  })
  const json = await parseJsonSafe(res)
  if (res.status === 400) throw json as ApiValidationError
  if (!res.ok) throw new Error(`Failed to create employee (${res.status})`)
  return json as Employee
}

export async function updateEmployee(id: number, emp: Employee): Promise<Employee> {
  const res = await fetch(`/api/employees/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(emp)
  })
  const json = await parseJsonSafe(res)
  if (res.status === 400) throw json as ApiValidationError
  if (res.status === 404) throw json as ApiNotFoundError
  if (!res.ok) throw new Error(`Failed to update employee (${res.status})`)
  return json as Employee
}

export async function deleteEmployee(id: number): Promise<void> {
  const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' })
  const json = await parseJsonSafe(res)
  if (res.status === 404) throw json as ApiNotFoundError
  if (!res.ok) throw new Error(`Failed to delete employee (${res.status})`)
}
