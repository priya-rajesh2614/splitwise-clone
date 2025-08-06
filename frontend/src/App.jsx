import './App.css'
import Header from './components/Header'
import { Route, Routes, useLocation } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/login'
import { UserProvider } from './UserContext'


function App() {

 const {pathname} =  useLocation()

  const isLoginOrRegister = pathname === '/login' || pathname === '/register';

  return (
    <UserProvider>
        {!isLoginOrRegister && <Header /> }
        <main style={{ paddingTop: isLoginOrRegister ? '' : '64px' }}>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
    </UserProvider>
  )
}

export default App
