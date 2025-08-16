// 📁 src/pages/CrearRemito.jsx
import React, { useEffect, useState } from 'react';
import { obtenerClientes } from '../services/clientService';
import { getProductos } from '../services/productService';
import { crearRemito } from '../services/remitoService';
import {
  Container, Typography, Button, MenuItem, TextField, Box, Grid, Paper
} from '@mui/material';

const CrearRemito = () => {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clienteId, setClienteId] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    obtenerClientes().then(setClientes);
    getProductos().then(res => setProductos(res.data));
  }, []);

  const handleCantidadChange = (productoId, litros) => {
    const producto = productos.find(p => p._id === productoId);
    const existente = items.find(item => item.producto === productoId);

    const nuevoItem = {
      producto: productoId,
      cantidadLitros: Number(litros),
      precioUnitario: producto.precioConsumidorFinal,
      subtotal: Number(litros) * producto.precioConsumidorFinal
    };

    const nuevosItems = existente
      ? items.map(item => item.producto === productoId ? nuevoItem : item)
      : [...items, nuevoItem];

    setItems(nuevosItems);
  };

  const handleCrearRemito = async () => {
    if (!clienteId || items.length === 0) return alert("Selecciona un cliente y al menos un producto");
    await crearRemito({ cliente: clienteId, productos: items });
    alert("Remito creado correctamente");
    setClienteId('');
    setItems([]);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Crear Remito</Typography>

      <TextField
        select fullWidth label="Seleccionar Cliente" value={clienteId}
        onChange={e => setClienteId(e.target.value)} sx={{ mb: 2 }}
      >
        {clientes.map(c => (
          <MenuItem key={c._id} value={c._id}>{c.nombre}</MenuItem>
        ))}
      </TextField>

      <Paper sx={{ p: 2, mb: 3 }}>
        {productos.map(p => (
          <Grid container spacing={2} key={p._id} alignItems="center" sx={{ mb: 1 }}>
            <Grid item xs={4}>{p.nombre}</Grid>
            <Grid item xs={4}>
              <TextField
                label="Litros"
                type="number"
                onChange={e => handleCantidadChange(p._id, e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>${p.precioConsumidorFinal}/L</Grid>
          </Grid>
        ))}
      </Paper>

      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleCrearRemito}>Guardar Remito</Button>
      </Box>
    </Container>
  );
};

export default CrearRemito;