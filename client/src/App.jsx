import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Rooms from './pages/Rooms'
import RoomDetail from './pages/RoomDetail'
import AdminRooms from './pages/AdminRooms'
import RoomForm from './pages/RoomForm'
import Navbar from './components/Navbar'
import ProtectedRoute from './routes/ProtectedRoute'
import RoleProtectedRoute from './routes/RoleProtectedRoute'

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/rooms"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                <AdminRooms />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/rooms/new"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                <RoomForm />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/rooms/:id/edit"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                <RoomForm />
              </RoleProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App