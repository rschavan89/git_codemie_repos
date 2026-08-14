import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  createEmployee,
  getEmployee,
  updateEmployee,
  type ApiNotFoundError,
  type ApiValidationError,
  type Employee
} from '../api/employees'

type Props = {
  mode: 'create' | 'edit'
}

function isValidationError(e: any): e is ApiValidationError {
  return e && e.error === 'VALIDATION_ERROR'
}

function isNotFoundError(e: any): e is ApiNotFoundError {
  return e && e.error === 'NOT_FOUND'
}

export default function EmployeeFormPage({ mode }: Props) {
  const navigate = useNavigate()
  const params = useParams()
  const id = useMemo(() => (params.id ? Number(params.id) : null), [params.id])

  const [loading, setLoading] = useState(mode === 'edit')
  const [notFound, setNotFound] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState('')
  const [salary, setSalary] = useState('')

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [errorBanner, setErrorBanner] = useState<string | null>(null)

  useEffect(() => {
    if (mode !== 'edit' || !id) return

    setLoading(true)
    setNotFound(false)
    void (async () => {
      try {
        const emp = await getEmployee(id)
        setName(emp.name ?? '')
        setEmail(emp.email ?? '')
        setDepartment(emp.department ?? '')
        setSalary(emp.salary != null ? String(emp.salary) : '')
      } catch (e: any) {
        if (isNotFoundError(e)) {
          setNotFound(true)
          return
        }
        setErrorBanner(e?.message ?? 'Failed to load')
      } finally {
        setLoading(false)
      }
    })()
  }, [mode, id])

  function validateClient(): Record<string, string> {
    const errors: Record<string, string> = {}
    if (!name.trim()) errors.name = 'Name is required'
    if (!email.trim()) errors.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Email must be valid'
    return errors
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorBanner(null)

    const clientErrors = validateClient()
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors)
      return
    }

    setFieldErrors({})

    const payload: Employee = {
      name: name.trim(),
      email: email.trim(),
      department: department.trim() || undefined,
      salary: salary.trim() ? Number(salary) : undefined
    }

    try {
      if (mode === 'create') {
        await createEmployee(payload)
      } else {
        await updateEmployee(id!, payload)
      }
      navigate('/employees')
    } catch (err: any) {
      if (isValidationError(err)) {
        setFieldErrors(err.fieldErrors ?? {})
        return
      }
      if (isNotFoundError(err)) {
        setNotFound(true)
        return
      }
      setErrorBanner(err?.message ?? 'Save failed')
    }
  }

  if (loading) return <div data-testid="loading">Loading...</div>

  if (notFound) {
    return (
      <div>
        <h2>Employee not found</h2>
        <div role="alert" data-testid="not-found">Employee not found.</div>
        <Link to="/employees">Back to list</Link>
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>{mode === 'create' ? 'Add Employee' : 'Edit Employee'}</h2>

      {errorBanner && (
        <div role="alert" style={{ color: 'crimson' }} data-testid="error-banner">
          {errorBanner}
        </div>
      )}

      <form onSubmit={onSubmit} data-testid="employee-form" style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
        <label>
          Name
          <input data-testid="name" value={name} onChange={(e) => setName(e.target.value)} />
          {fieldErrors.name && (
            <div style={{ color: 'crimson' }} data-testid="error-name">{fieldErrors.name}</div>
          )}
        </label>

        <label>
          Email
          <input data-testid="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {fieldErrors.email && (
            <div style={{ color: 'crimson' }} data-testid="error-email">{fieldErrors.email}</div>
          )}
        </label>

        <label>
          Department
          <input data-testid="department" value={department} onChange={(e) => setDepartment(e.target.value)} />
        </label>

        <label>
          Salary
          <input data-testid="salary" value={salary} onChange={(e) => setSalary(e.target.value)} />
        </label>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" data-testid="save">Save</button>
          <Link to="/employees">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
