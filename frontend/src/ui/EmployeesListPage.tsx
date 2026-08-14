import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteEmployee, listEmployees, type Employee } from '../api/employees'

export default function EmployeesListPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await listEmployees()
      setEmployees(data)
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function onDelete(id: number) {
    if (!confirm('Delete employee?')) return
    try {
      await deleteEmployee(id)
      await load()
    } catch (e: any) {
      setError(e?.message ?? 'Failed to delete')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ marginTop: 0 }}>Employees</h2>
        <Link to="/employees/new" data-testid="add-employee">Add Employee</Link>
      </div>

      {loading && <div data-testid="loading">Loading...</div>}
      {error && (
        <div role="alert" style={{ color: 'crimson' }} data-testid="error-banner">
          {error}
        </div>
      )}

      <table data-testid="employees-table" border={1} cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse' }}>
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
          {employees.map((e) => (
            <tr key={e.id} data-testid={`employee-row-${e.id}`}>
              <td>{e.id}</td>
              <td>{e.name}</td>
              <td>{e.email}</td>
              <td>{e.department ?? ''}</td>
              <td>{e.salary ?? ''}</td>
              <td>
                <Link to={`/employees/${e.id}/edit`} data-testid={`edit-${e.id}`}>Edit</Link>
                {' | '}
                <button onClick={() => onDelete(e.id!)} data-testid={`delete-${e.id}`}>Delete</button>
              </td>
            </tr>
          ))}
          {!loading && employees.length === 0 && (
            <tr>
              <td colSpan={6}>No employees</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
