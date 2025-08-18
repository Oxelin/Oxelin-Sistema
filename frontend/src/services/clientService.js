import axios from 'axios';

const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/clientes';

export const getClientes = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createCliente = async (clienteData) => {
  const res = await axios.post(API_URL, clienteData);
  return res.data;
};

export const updateCliente = async (id, updatedData) => {
  const res = await axios.put(`${API_URL}/${id}`, updatedData);
  return res.data;
};

export const deleteCliente = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
