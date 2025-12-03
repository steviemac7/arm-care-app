import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Signup from './components/Signup'
import PrivateRoute from './components/PrivateRoute'
import AdminDashboard from './components/AdminDashboard'

const ADMIN_EMAIL = 'stvmcdnld@gmail.com'

function AdminRoute({ children }) {
  const { currentUser } = useAuth()

  if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
    return <Navigate to="/" />
  }

  return children
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
