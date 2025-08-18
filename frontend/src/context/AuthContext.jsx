// 📁 src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';
import { login as loginService } from '../services/authService'; // 👈 usa el servicio central

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const tokenFromStorage = localStorage.getItem('token');
  const [token, setToken] = useState(tokenFromStorage);

  const login = async (username, password) => {
    try {
      const data = await loginService({ username, password }); // usa el servicio

      localStorage.setItem('token', data.data.token); // data.data porque axios devuelve {data: ...}
      setToken(data.data.token);
      return true;
    } catch (err) {
      console.error('Error en login:', err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
