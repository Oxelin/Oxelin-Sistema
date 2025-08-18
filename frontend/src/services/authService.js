// src/services/authService.js
import axios from 'axios';

const BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/auth';

export const register = async (data) => {
  return await axios.post(`${BASE_URL}/register`, data); // ✅ aquí /api/auth/register
};

export const login = async (data) => {
  return await axios.post(`${BASE_URL}/login`, data);
};
