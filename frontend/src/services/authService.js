// src/services/authService.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const register = (data) => API.post('/users/register', data);
export const login = (credentials) => API.post('/auth/login', credentials);