import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Button, Paper, InputAdornment,
  CircularProgress, useMediaQuery
} from '@mui/material';
import { Delete, Edit, Add, Search } from '@mui/icons-material';
import { getProductos, crearProducto, actualizarProducto, eliminarProducto } from '../services/productService';
import DialogConfirm from '../components/DialogConfirm';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

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
    nombre: '', costo: '', precioConsumidorFinal: '', precioRevendedor: '', stock: ''
  });

  const isMobile = useMediaQuery("(max-width:600px)");

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const res = await getProductos();
      setProductos(res.data);
      setFilteredProductos(res.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      toast.error("Error cargando productos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProductos(); }, []);

  const handleSearch = (value) => {
    setSearch(value);
    const lowerValue = value.toLowerCase();
    setFilteredProductos(
      productos.filter((p) =>
        p.nombre.toLowerCase().includes(lowerValue)
      )
    );
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
      toast.success("Producto creado correctamente");
    } catch (error) {
      console.error("Error al crear producto:", error);
      toast.error("Error al crear producto");
    } finally { setLoadingCreate(false); }
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
      toast.success("Producto actualizado correctamente");
    } catch (error) {
      console.error("Error al editar producto:", error);
      toast.error("Error al actualizar producto");
    } finally { setLoadingEdit(false); }
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
      toast.success("Producto eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      toast.error("Error al eliminar producto");
    } finally { setLoadingDelete(false); }
  };

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexDirection={isMobile ? 'column' : 'row'}>
        <Typography variant="h4" fontWeight="bold" color="primary" mb={isMobile ? 2 : 0}>
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
        <Paper sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>Nombre</strong></TableCell>
                {!isMobile && <TableCell><strong>Costo</strong></TableCell>}
                {!isMobile && <TableCell><strong>Precio Consumidor</strong></TableCell>}
                {!isMobile && <TableCell><strong>Precio Revendedor</strong></TableCell>}
                {!isMobile && <TableCell><strong>Stock</strong></TableCell>}
                <TableCell><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {filteredProductos.map((prod, index) => (
                  <motion.tr
                    key={prod._id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    style={{ backgroundColor: index % 2 ? '#fafafa' : 'white' }}
                    whileHover={{ scale: 1.02, backgroundColor: "#f0f0f0" }}
                  >
                    <TableCell>{prod.nombre}</TableCell>
                    {!isMobile && <TableCell>${prod.costo}</TableCell>}
                    {!isMobile && <TableCell>${prod.precioConsumidorFinal}</TableCell>}
                    {!isMobile && <TableCell>${prod.precioRevendedor}</TableCell>}
                    {!isMobile && <TableCell>{prod.stock}</TableCell>}
                    <TableCell>
                      <motion.div whileTap={{ scale: 0.8 }}>
                        <IconButton onClick={() => handleEditOpen(prod)} color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(prod)} color="error">
                          <Delete />
                        </IconButton>
                      </motion.div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Dialog crear */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
        <DialogTitle>Agregar Producto</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {["nombre","costo","precioConsumidorFinal","precioRevendedor","stock"].map((field) => (
            <TextField
              key={field}
              label={field === "precioConsumidorFinal" ? "Precio Consumidor" : field === "precioRevendedor" ? "Precio Revendedor" : field.charAt(0).toUpperCase() + field.slice(1)}
              name={field}
              type={["costo","precioConsumidorFinal","precioRevendedor","stock"].includes(field) ? "number" : "text"}
              value={form[field]}
              onChange={handleChange}
            />
          ))}
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
          {["nombre","costo","precioConsumidorFinal","precioRevendedor","stock"].map((field) => (
            <TextField
              key={field}
              label={field === "precioConsumidorFinal" ? "Precio Consumidor" : field === "precioRevendedor" ? "Precio Revendedor" : field.charAt(0).toUpperCase() + field.slice(1)}
              name={field}
              type={["costo","precioConsumidorFinal","precioRevendedor","stock"].includes(field) ? "number" : "text"}
              value={form[field]}
              onChange={handleChange}
            />
          ))}
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
        loading={loadingDelete}
        message="¿Estás seguro que deseas eliminar este producto?"
      />
    </Box>
  );
}
