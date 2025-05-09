import { useState, useEffect, useContext, createContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: ""
  });

  // Load auth state from local storage on app load
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, []);

  // Update local storage whenever auth state changes
  useEffect(() => {
    if (auth.token) {
      localStorage.setItem('auth', JSON.stringify(auth));
      axios.defaults.headers.common["Authorization"] = auth.token;
    } else {
      localStorage.removeItem('auth');
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };