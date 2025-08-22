// 📁 src/services/remitoService.js
import axios from 'axios';

// Base URL según entorno
const BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/remitos';

// Funciones del servicio
export const crearRemito = async (data) => {
  return await axios.post(BASE_URL, data);
};

export const obtenerRemitos = async () => {
  return await axios.get(BASE_URL);
};

export const eliminarRemito = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};

// 🔹 Nueva función para obtener costos
export const obtenerCostos = async (query = '') => {
  // query es un string con los parámetros URL, ej: "clienteId=xxx&fechaInicio=2025-08-01&fechaFin=2025-08-31"
  const url = query ? `${BASE_URL}/costos?${query}` : `${BASE_URL}/costos`;
  return await axios.get(url);
};
