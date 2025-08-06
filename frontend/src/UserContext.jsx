import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
 
  const [user, setUserState] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    console.log("Stored User:", storedUser);
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    }
  }, []);

  const setUser = (userData) => {
    setUserState(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  if(!user)return


  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
