import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import ProtectedRoute from './ProtectedRoute'
import { UserProvider } from './UserContext'
import CreateGroup from './components/CreateGroup'
import GroupList from './components/GroupList'
import Header from './components/Header'
import Register from './components/Register'
import Login from './components/login'
import ViewGroup from './components/ViewGroup'
import AddExpense from './components/AddExpence'
import AddMembers from './components/AddMembers'


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
          <Route path="/groups/:groupId" element={<ProtectedRoute><ViewGroup /></ProtectedRoute>} />
          <Route path="/groups/:groupId/add-expense" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
          <Route path="/groups/:groupId/add-members" element={<ProtectedRoute><AddMembers /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </UserProvider>
  )
}

export default App
