import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Button, Paper, InputAdornment, CircularProgress
} from '@mui/material';
import { Delete, Edit, Add, Search } from '@mui/icons-material';
import {
  getProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../services/productService';
import DialogConfirm from '../components/DialogConfirm';

export default function ProductListPage() {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    costo: '',
    precioConsumidorFinal: '',
    precioRevendedor: '',
    stock: ''
  });

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const res = await getProductos();
      setProductos(res.data);
      setFilteredProductos(res.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
    const lowerValue = value.toLowerCase();
    setFilteredProductos(
      productos.filter((p) =>
        p.nombre.toLowerCase().includes(lowerValue)
      )
    );
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateOpen = () => {
    setForm({ nombre: '', costo: '', precioConsumidorFinal: '', precioRevendedor: '', stock: '' });
    setCreateOpen(true);
  };

  const handleCreate = async () => {
    try {
      setLoadingCreate(true);
      await crearProducto(form);
      await fetchProductos();
      setCreateOpen(false);
    } catch (error) {
      console.error("Error al crear producto:", error);
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleEditOpen = (producto) => {
    setSelectedProduct(producto);
    setForm({
      nombre: producto.nombre,
      costo: producto.costo,
      precioConsumidorFinal: producto.precioConsumidorFinal,
      precioRevendedor: producto.precioRevendedor,
      stock: producto.stock
    });
    setEditOpen(true);
  };

  const handleEdit = async () => {
    try {
      setLoadingEdit(true);
      await actualizarProducto(selectedProduct._id, form);
      await fetchProductos();
      setEditOpen(false);
    } catch (error) {
      console.error("Error al editar producto:", error);
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleDeleteClick = (producto) => {
    setSelectedProduct(producto);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoadingDelete(true);
      await eliminarProducto(selectedProduct._id);
      await fetchProductos();
      setConfirmOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <Box p={3}>
      {/* Encabezado */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          📦 Lista de Productos
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreateOpen}>
          Agregar Producto
        </Button>
      </Box>

      {/* Buscador */}
      <Paper sx={{ mb: 2, p: 1 }}>
        <TextField
          placeholder="Buscar producto por nombre..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            )
          }}
        />
      </Paper>

      {/* Loading o Tabla */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="300px">
          <CircularProgress size={60} />
        </Box>
      ) : (
        <Paper>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>Nombre</strong></TableCell>
                <TableCell><strong>Costo</strong></TableCell>
                <TableCell><strong>Precio Consumidor</strong></TableCell>
                <TableCell><strong>Precio Revendedor</strong></TableCell>
                <TableCell><strong>Stock</strong></TableCell>
                <TableCell><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProductos.map((prod, index) => (
                <TableRow key={prod._id} sx={{ backgroundColor: index % 2 ? '#fafafa' : 'white' }}>
                  <TableCell>{prod.nombre}</TableCell>
                  <TableCell>${prod.costo}</TableCell>
                  <TableCell>${prod.precioConsumidorFinal}</TableCell>
                  <TableCell>${prod.precioRevendedor}</TableCell>
                  <TableCell>{prod.stock}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditOpen(prod)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(prod)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Dialog crear */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
        <DialogTitle>Agregar Producto</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} />
          <TextField label="Costo" name="costo" type="number" value={form.costo} onChange={handleChange} />
          <TextField label="Precio Consumidor" name="precioConsumidorFinal" type="number" value={form.precioConsumidorFinal} onChange={handleChange} />
          <TextField label="Precio Revendedor" name="precioRevendedor" type="number" value={form.precioRevendedor} onChange={handleChange} />
          <TextField label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange} />
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
        <DialogTitle>Editar Producto</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} />
          <TextField label="Costo" name="costo" type="number" value={form.costo} onChange={handleChange} />
          <TextField label="Precio Consumidor" name="precioConsumidorFinal" type="number" value={form.precioConsumidorFinal} onChange={handleChange} />
          <TextField label="Precio Revendedor" name="precioRevendedor" type="number" value={form.precioRevendedor} onChange={handleChange} />
          <TextField label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange} />
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
        loading={loadingDelete} // 👈 Pasamos el estado de carga
        message="¿Estás seguro que deseas eliminar este producto?"
      />
    </Box>
  );
}
