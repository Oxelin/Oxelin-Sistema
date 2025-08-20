import React, { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Button, Paper, TableContainer,
  InputAdornment, MenuItem, CircularProgress, useMediaQuery
} from "@mui/material";
import { Delete, Edit, Add, Search, People } from "@mui/icons-material";
import { getClientes, createCliente, updateCliente, deleteCliente } from "../services/clientService";
import DialogConfirm from "../components/DialogConfirm";
import { motion } from "framer-motion";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [form, setForm] = useState({ nombre: "", tipo: "", telefono: "", ubicacion: "" });

  const isMobile = useMediaQuery("(max-width:600px)");

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
      console.error("Error al obtener clientes", err);
      setClientes([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClientes(); }, []);

  useEffect(() => {
    let data = clientes?.filter(c =>
      c.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
    if (tipoFilter) {
      data = data.filter(c => c.tipo === tipoFilter);
    }
    setFiltered(data);
  }, [searchTerm, tipoFilter, clientes]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleCreateOpen = () => { setForm({ nombre: "", tipo: "", telefono: "", ubicacion: "" }); setCreateOpen(true); };

  const handleCreate = async () => {
    try { setLoadingCreate(true); await createCliente(form); await fetchClientes(); setCreateOpen(false); }
    catch (err) { console.error("Error al crear cliente:", err.response?.data || err.message); }
    finally { setLoadingCreate(false); }
  };

  const handleEditOpen = (cliente) => {
    setSelectedCliente(cliente);
    setForm({ nombre: cliente.nombre || "", tipo: cliente.tipo || "", telefono: cliente.telefono || "", ubicacion: cliente.ubicacion || "" });
    setEditOpen(true);
  };

  const handleEdit = async () => {
    try { setLoadingEdit(true); await updateCliente(selectedCliente._id, form); await fetchClientes(); setEditOpen(false); }
    catch (err) { console.error("Error al editar cliente:", err.response?.data || err.message); }
    finally { setLoadingEdit(false); }
  };

  const handleDeleteClick = (cliente) => { setSelectedCliente(cliente); setConfirmOpen(true); };
  const handleConfirmDelete = async () => { await deleteCliente(selectedCliente._id); fetchClientes(); setConfirmOpen(false); setSelectedCliente(null); };

  return (
    <Box p={isMobile ? 2 : 3} sx={{ width: "100%", maxWidth: "100%" }}>
      {/* Header */}
      <Box display="flex" flexDirection={isMobile ? "column" : "row"} justifyContent="space-between" alignItems={isMobile ? "stretch" : "center"} mb={2} gap={isMobile ? 1 : 0}>
        <Box display="flex" alignItems="center" gap={1}>
          <People color="primary" />
          <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">Lista de Clientes</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreateOpen} sx={{ mt: isMobile ? 1 : 0 }}>
          Agregar Cliente
        </Button>
      </Box>

      {/* Filtros */}
      <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={2} mb={2}>
        <TextField
          variant="outlined"
          placeholder="Buscar cliente por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>) }}
          fullWidth
        />
        <TextField
          select
          variant="outlined"
          label="Tipo"
          value={tipoFilter}
          onChange={(e) => setTipoFilter(e.target.value)}
          sx={{ minWidth: isMobile ? "100%" : 200 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="Consumidor Final">Consumidor Final</MenuItem>
          <MenuItem value="Revendedor">Revendedor</MenuItem>
        </TextField>
      </Box>

      {/* Loading o Lista */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="300px">
          <CircularProgress size={60} />
        </Box>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          {isMobile ? (
            // 📱 Vista en cards
            <Box display="flex" flexDirection="column" gap={2}>
              {filtered.map((cliente) => (
                <Paper key={cliente._id} sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">{cliente.nombre}</Typography>
                  <Typography variant="body2">Tipo: {cliente.tipo}</Typography>
                  {cliente.telefono && <Typography variant="body2">Tel: {cliente.telefono}</Typography>}
                  {cliente.ubicacion && <Typography variant="body2">Dir: {cliente.ubicacion}</Typography>}
                  <Box display="flex" justifyContent="flex-end" mt={1}>
                    <IconButton onClick={() => handleEditOpen(cliente)} color="primary"><Edit /></IconButton>
                    <IconButton onClick={() => handleDeleteClick(cliente)} color="error"><Delete /></IconButton>
                  </Box>
                </Paper>
              ))}
            </Box>
          ) : (
            // 💻 Vista en tabla
            <Paper elevation={3} sx={{ width: "100%", overflowX: "auto" }}>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell><strong>Nombre</strong></TableCell>
                      <TableCell><strong>Tipo</strong></TableCell>
                      <TableCell><strong>Teléfono</strong></TableCell>
                      <TableCell><strong>Dirección</strong></TableCell>
                      <TableCell><strong>Acciones</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered.map((cliente) => (
                      <TableRow key={cliente._id} hover>
                        <TableCell>{cliente.nombre}</TableCell>
                        <TableCell>{cliente.tipo}</TableCell>
                        <TableCell>{cliente.telefono}</TableCell>
                        <TableCell>{cliente.ubicacion}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEditOpen(cliente)} color="primary"><Edit /></IconButton>
                          <IconButton onClick={() => handleDeleteClick(cliente)} color="error"><Delete /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </motion.div>
      )}

      {/* Dialogs */}
      <Dialog fullWidth maxWidth="sm" open={createOpen} onClose={() => setCreateOpen(false)}>
        <DialogTitle>Agregar Cliente</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} fullWidth />
          <TextField select label="Tipo" name="tipo" value={form.tipo} onChange={handleChange} fullWidth>
            <MenuItem value="Consumidor Final">Consumidor Final</MenuItem>
            <MenuItem value="Revendedor">Revendedor</MenuItem>
          </TextField>
          <TextField label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} fullWidth />
          <TextField label="Dirección" name="ubicacion" value={form.ubicacion} onChange={handleChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)} disabled={loadingCreate}>Cancelar</Button>
          <Button onClick={handleCreate} variant="contained" disabled={loadingCreate} startIcon={loadingCreate && <CircularProgress size={20} color="inherit" />}>
            {loadingCreate ? "Creando..." : "Agregar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog fullWidth maxWidth="sm" open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Editar Cliente</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} fullWidth />
          <TextField select label="Tipo" name="tipo" value={form.tipo} onChange={handleChange} fullWidth>
            <MenuItem value="Consumidor Final">Consumidor Final</MenuItem>
            <MenuItem value="Revendedor">Revendedor</MenuItem>
          </TextField>
          <TextField label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} fullWidth />
          <TextField label="Dirección" name="ubicacion" value={form.ubicacion} onChange={handleChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} disabled={loadingEdit}>Cancelar</Button>
          <Button onClick={handleEdit} variant="contained" disabled={loadingEdit} startIcon={loadingEdit && <CircularProgress size={20} color="inherit" />}>
            {loadingEdit ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      <DialogConfirm open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleConfirmDelete} message="¿Estás seguro que deseas eliminar este cliente?" />
    </Box>
  );
}
