// src/pages/Costos.jsx
import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, Grid,
  FormControl, InputLabel, Select, MenuItem,
  Button, TableContainer, Table, TableHead, TableRow,
  TableCell, TableBody, CircularProgress, TextField, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { obtenerCostos } from '../services/remitoService';
import { toast } from 'react-toastify';
import { format, parseISO } from 'date-fns';

const Costos = () => {
  const [remitos, setRemitos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [filtroCliente, setFiltroCliente] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchRemitos = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filtroCliente) params.append('clienteId', filtroCliente);
      if (fechaInicio) params.append('fechaInicio', fechaInicio);
      if (fechaFin) params.append('fechaFin', fechaFin);

      const res = await obtenerCostos(params.toString());
      setRemitos(res.data.remitos || []);
    } catch (error) {
      console.error(error);
      toast.error('Error al obtener costos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRemitos();
  }, [filtroCliente, fechaInicio, fechaFin]);

  useEffect(() => {
    // Extraer clientes únicos de los remitos para el filtro
    const uniqueClients = [...new Set(remitos.map(r => r.cliente))];
    setClientes(uniqueClients);
  }, [remitos]);

  const totalGeneral = remitos.reduce((acc, r) => acc + r.totalCosto, 0);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Filtros */}
      <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Costos de Remitos
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Cliente</InputLabel>
              <Select
                value={filtroCliente}
                onChange={e => setFiltroCliente(e.target.value)}
                label="Cliente"
              >
                <MenuItem value="">Todos</MenuItem>
                {clientes.map(c => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              type="date"
              label="Desde"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              type="date"
              label="Hasta"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={fechaFin}
              onChange={e => setFechaFin(e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Total general */}
      <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
        <Typography variant="h6" gutterBottom>Total general de costos: ${totalGeneral.toLocaleString()}</Typography>
      </Paper>

      {/* Tabla */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ background: '#f0f0f0' }}>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Total Costo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {remitos.map(r => (
              <TableRow key={r._id}>
                <TableCell>{r.cliente}</TableCell>
                <TableCell>{format(parseISO(r.fecha), 'dd/MM/yyyy')}</TableCell>
                <TableCell>${r.totalCosto.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Costos;
