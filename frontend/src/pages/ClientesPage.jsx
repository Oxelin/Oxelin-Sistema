import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Button, Paper, TableContainer, InputAdornment, MenuItem, CircularProgress
} from '@mui/material';
import { Delete, Edit, Add, Search, People } from '@mui/icons-material';
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente
} from '../services/clientService';
import DialogConfirm from '../components/DialogConfirm';

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false); // 👈 Loading del crear
  const [loadingEdit, setLoadingEdit] = useState(false); // 👈 Loading del editar
  const [form, setForm] = useState({
    nombre: '',
    tipo: '',
    telefono: '',
    ubicacion: ''
  });

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const data = await getClientes();
      if (Array.isArray(data)) {
        setClientes(data);
        setFiltered(data);
      } else {
        setClientes([]);
        setFiltered([]);
      }
    } catch (err) {
      console.error('Error al obtener clientes', err);
      setClientes([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    let data = clientes?.filter(c =>
      c.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
    if (tipoFilter) {
      data = data.filter(c => c.tipo === tipoFilter);
    }
    setFiltered(data);
  }, [searchTerm, tipoFilter, clientes]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateOpen = () => {
    setForm({ nombre: '', tipo: '', telefono: '', ubicacion: '' });
    setCreateOpen(true);
  };

  const handleCreate = async () => {
    try {
      setLoadingCreate(true); // 👈 empieza loading del botón
      await createCliente(form);
      await fetchClientes();
      setCreateOpen(false);
    } catch (err) {
      console.error("Error al crear cliente:", err.response?.data || err.message);
    } finally {
      setLoadingCreate(false); // 👈 termina loading
    }
  };

  const handleEditOpen = (cliente) => {
    setSelectedCliente(cliente);
    setForm({
      nombre: cliente.nombre || '',
      tipo: cliente.tipo || '',
      telefono: cliente.telefono || '',
      ubicacion: cliente.ubicacion || ''
    });
    setEditOpen(true);
  };

  const handleEdit = async () => {
    try {
      setLoadingEdit(true); // 👈 empieza loading del botón
      await updateCliente(selectedCliente._id, form);
      await fetchClientes();
      setEditOpen(false);
    } catch (err) {
      console.error("Error al editar cliente:", err.response?.data || err.message);
    } finally {
      setLoadingEdit(false); // 👈 termina loading
    }
  };

  const handleDeleteClick = (cliente) => {
    setSelectedCliente(cliente);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    await deleteCliente(selectedCliente._id);
    fetchClientes();
    setConfirmOpen(false);
    setSelectedCliente(null);
  };

  return (
    <Box p={3} sx={{ width: '100%', maxWidth: '100%' }}>
      {/* Header con icono y botón */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} sx={{ width: '100%' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <People color="primary" />
          <Typography variant="h5" fontWeight="bold">Lista de Clientes</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreateOpen}>
          Agregar Cliente
        </Button>
      </Box>

      {/* Barra de búsqueda y filtro */}
      <Box display="flex" gap={2} mb={2} sx={{ width: '100%' }}>
        <TextField
          variant="outlined"
          placeholder="Buscar cliente por nombre..."
          sx={{ flexGrow: 1 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
        />
        <TextField
          select
          variant="outlined"
          label="Tipo"
          value={tipoFilter}
          onChange={(e) => setTipoFilter(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="Consumidor Final">Consumidor Final</MenuItem>
          <MenuItem value="Revendedor">Revendedor</MenuItem>
        </TextField>
      </Box>

      {/* Loading o Tabla */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="300px">
          <CircularProgress size={60} />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ width: '100%' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell><strong>Nombre</strong></TableCell>
                  <TableCell><strong>Tipo</strong></TableCell>
                  <TableCell><strong>Teléfono</strong></TableCell>
                  <TableCell><strong>Dirección</strong></TableCell>
                  <TableCell><strong>Acciones</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(filtered || []).map((cliente) => (
                  <TableRow key={cliente._id} hover>
                    <TableCell>{cliente.nombre}</TableCell>
                    <TableCell>{cliente.tipo}</TableCell>
                    <TableCell>{cliente.telefono}</TableCell>
                    <TableCell>{cliente.ubicacion}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditOpen(cliente)} color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteClick(cliente)} color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Dialog crear */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
        <DialogTitle>Agregar Cliente</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} />
          <TextField select label="Tipo" name="tipo" value={form.tipo} onChange={handleChange}>
            <MenuItem value="Consumidor Final">Consumidor Final</MenuItem>
            <MenuItem value="Revendedor">Revendedor</MenuItem>
          </TextField>
          <TextField label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} />
          <TextField label="Dirección" name="ubicacion" value={form.ubicacion} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)} disabled={loadingCreate}>Cancelar</Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={loadingCreate}
            startIcon={loadingCreate && <CircularProgress size={20} color="inherit" />}
          >
            {loadingCreate ? "Creando..." : "Agregar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog editar */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Editar Cliente</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} />
          <TextField select label="Tipo" name="tipo" value={form.tipo} onChange={handleChange}>
            <MenuItem value="Consumidor Final">Consumidor Final</MenuItem>
            <MenuItem value="Revendedor">Revendedor</MenuItem>
          </TextField>
          <TextField label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} />
          <TextField label="Dirección" name="ubicacion" value={form.ubicacion} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} disabled={loadingEdit}>Cancelar</Button>
          <Button
            onClick={handleEdit}
            variant="contained"
            disabled={loadingEdit}
            startIcon={loadingEdit && <CircularProgress size={20} color="inherit" />}
          >
            {loadingEdit ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog confirmar */}
      <DialogConfirm
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        message="¿Estás seguro que deseas eliminar este cliente?"
      />
    </Box>
  );
}
