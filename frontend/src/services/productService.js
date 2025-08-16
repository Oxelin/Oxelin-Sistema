import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products'; // ajustá según tu entorno

export const getProductos = () => axios.get(API_URL);
export const crearProducto = (data) => axios.post(API_URL, data);
export const actualizarProducto = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const eliminarProducto = (id) => axios.delete(`${API_URL}/${id}`);