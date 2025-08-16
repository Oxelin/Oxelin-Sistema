import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';

const ProductForm = ({ fetchProducts }) => {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precioConsumidor: '',
    precioRevendedor: '',
    stock: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/products', form);
      setForm({ nombre: '', descripcion: '', precioConsumidor: '', precioRevendedor: '', stock: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error al agregar producto', error);
    }
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h6" mb={2}>Agregar Producto</Typography>
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} margin="normal" />
        <TextField fullWidth label="Descripción" name="descripcion" value={form.descripcion} onChange={handleChange} margin="normal" />
        <TextField fullWidth type="number" label="Precio Consumidor" name="precioConsumidor" value={form.precioConsumidor} onChange={handleChange} margin="normal" />
        <TextField fullWidth type="number" label="Precio Revendedor" name="precioRevendedor" value={form.precioRevendedor} onChange={handleChange} margin="normal" />
        <TextField fullWidth type="number" label="Stock" name="stock" value={form.stock} onChange={handleChange} margin="normal" />
        <Button type="submit" variant="contained" color="primary">Guardar</Button>
      </form>
    </Box>
  );
};

export default ProductForm;
