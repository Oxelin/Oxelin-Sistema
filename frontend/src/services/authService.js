// src/services/authService.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const register = (data) => API.post('/users/register', data);
export const login = (credentials) => API.post('/auth/login', credentials);
