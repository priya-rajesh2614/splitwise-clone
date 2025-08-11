import { createContext, useContext, useEffect, useState } from "react";
import {
  CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {

  const [user, setUserState] = useState(null);

  const location = useLocation();
  const naviagate = useNavigate();
  const publicPaths = ["/login", "/register"];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    }else{
      naviagate('/login');
    }
  }, []);

  const setUser = (userData) => {
    setUserState(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  if (!user && !publicPaths.includes(location.pathname)) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <CircularProgress size={50} thickness={4} />
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
