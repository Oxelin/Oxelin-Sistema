// src/services/remitoService.js
import axios from 'axios';

export const crearRemito = async (data) => {
  return await axios.post('http://localhost:5000/api/remitos', data);
};

export const obtenerRemitos = async () => {
  return await axios.get('http://localhost:5000/api/remitos');
};

export const eliminarRemito = async (id) => {
  return await axios.delete(`http://localhost:5000/api/remitos/${id}`);
};