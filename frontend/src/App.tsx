// src/App.tsx
import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register'
import { useAuth } from './contexts/AuthContext'
import DashboardLayout from './components/DashboardLayout'
import DashboardHome from './pages/dashboard'
import StudentsPage from './pages/dashboard/students'
import NewStudentPage from './pages/dashboard/students/new'
import NewSubjectPage from './pages/dashboard/subjects/new'
import EditSubjectPage from './pages/dashboard/subjects/[id]'
import SubjectsPage from './pages/dashboard/subjects'
import GradesPage from './pages/dashboard/grades'
import NewGradePage from './pages/dashboard/grades/new'

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas del dashboard */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Outlet />
              </DashboardLayout>
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          {/* Estudiantes */}
          <Route path="students" element={<StudentsPage />} />
          <Route path="students/new" element={<NewStudentPage />} />
          {/* Materias */}
          <Route path="subjects" element={<SubjectsPage />} />
          <Route path="subjects/new" element={<NewSubjectPage />} />
          <Route path="subjects/:id" element={<EditSubjectPage />} />
          {/* Calificaciones */}	
          <Route path="grades" element={<GradesPage />} />
          <Route path="grades/new" element={<NewGradePage />} />
          {/* Ruta catch-all en dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Cualquier otra ruta */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
