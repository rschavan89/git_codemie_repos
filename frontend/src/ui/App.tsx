import { Link, Navigate, Route, Routes } from 'react-router-dom'
import EmployeesListPage from './EmployeesListPage'
import EmployeeFormPage from './EmployeeFormPage'

export default function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: 16 }}>
      <header style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>Employee Management</h1>
        <nav style={{ display: 'flex', gap: 8 }}>
          <Link to="/employees" data-testid="nav-employees">Employees</Link>
          <Link to="/employees/new" data-testid="nav-new">Add</Link>
        </nav>
      </header>

      <main style={{ marginTop: 16 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/employees" replace />} />
          <Route path="/employees" element={<EmployeesListPage />} />
          <Route path="/employees/new" element={<EmployeeFormPage mode="create" />} />
          <Route path="/employees/:id/edit" element={<EmployeeFormPage mode="edit" />} />
        </Routes>
      </main>
    </div>
  )
}
