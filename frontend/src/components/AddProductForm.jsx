import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function AddProductForm({ onProductAdded }) {
  const [product, setProduct] = useState({
    nombre: '',
    costo: '',
    precioConsumidorFinal: '',
    precioRevendedor: '',
    stock: ''
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/products', product);
      toast.success('Producto agregado correctamente');
      onProductAdded?.();
      setProduct({
        nombre: '',
        costo: '',
        precioConsumidorFinal: '',
        precioRevendedor: '',
        stock: ''
      });
    } catch (error) {
      console.error(error);
      toast.error('Error al agregar producto');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <TextField label="Nombre" name="nombre" value={product.nombre} onChange={handleChange} required />
      <TextField label="Costo" name="costo" type="number" value={product.costo} onChange={handleChange} required />
      <TextField label="Precio Consumidor" name="precioConsumidorFinal" type="number" value={product.precioConsumidorFinal} onChange={handleChange} required />
      <TextField label="Precio Revendedor" name="precioRevendedor" type="number" value={product.precioRevendedor} onChange={handleChange} required />
      <TextField label="Stock" name="stock" type="number" value={product.stock} onChange={handleChange} required />
      <Button variant="contained" type="submit">Agregar</Button>
    </Box>
  );
}
