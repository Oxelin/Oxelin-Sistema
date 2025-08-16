import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Typography, Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5000/api/products');
    setProducts(res.data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar producto?')) {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Box mt={4}>
      <Typography variant="h6" mb={2}>Lista de Productos</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Costo</TableCell>
            <TableCell>Precio Consumidor</TableCell>
            <TableCell>Precio Revendedor</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map(p => (
            <TableRow key={p._id}>
              <TableCell>{p.nombre}</TableCell>
              <TableCell>${p.costo}</TableCell>
              <TableCell>${p.precioConsumidorFinal}</TableCell>
              <TableCell>${p.precioRevendedor}</TableCell>
              <TableCell>{p.stock}</TableCell>
              <TableCell>
                <IconButton><EditIcon /></IconButton>
                <IconButton onClick={() => handleDelete(p._id)}><DeleteIcon color="error" /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ProductList;
