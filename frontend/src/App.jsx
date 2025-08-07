import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import ProtectedRoute from './ProtectedRoute'
import { UserProvider } from './UserContext'
import CreateGroup from './components/CreateGroup'
import GroupList from './components/GroupList'
import Header from './components/Header'
import Register from './components/Register'
import Login from './components/login'


function App() {

  const { pathname } = useLocation()

  const isLoginOrRegister = pathname === '/login' || pathname === '/register';

  return (
    <UserProvider>
      {!isLoginOrRegister && <Header />}
      <main style={{ paddingTop: isLoginOrRegister ? '' : '64px' }}>
        <Routes>
          <Route path='/' element={<Navigate to='/groups' />} />
          <Route path='/groups' element={<ProtectedRoute><GroupList /></ProtectedRoute>} />
          <Route path='/create-group' element={<ProtectedRoute><CreateGroup /></ProtectedRoute>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </UserProvider>
  )
}

export default App
