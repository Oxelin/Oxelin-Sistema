import React, { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Button, Paper, InputAdornment,
  CircularProgress, useMediaQuery, TableContainer
} from "@mui/material";
import { Delete, Edit, Add, Search } from "@mui/icons-material";
import { getProductos, crearProducto, actualizarProducto, eliminarProducto } from "../services/productService";
import DialogConfirm from "../components/DialogConfirm";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function ProductListPage() {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  the const [selectedProduct, setSelectedProduct] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    costo: "",
    precioConsumidorFinal: "",
    precioRevendedor: "",
    stock: "",
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
    const lower = value.toLowerCase();
    setFilteredProductos(
      productos.filter((p) => p.nombre?.toLowerCase().includes(lower))
    );
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreateOpen = () => {
    setForm({
      nombre: "",
      costo: "",
      precioConsumidorFinal: "",
      precioRevendedor: "",
      stock: "",
    });
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
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleEditOpen = (producto) => {
    setSelectedProduct(producto);
    setForm({
      nombre: producto.nombre ?? "",
      costo: producto.costo ?? "",
      precioConsumidorFinal: producto.precioConsumidorFinal ?? "",
      precioRevendedor: producto.precioRevendedor ?? "",
      stock: producto.stock ?? "",
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
      console.error("Error al actualizar producto:", error);
      toast.error("Error al actualizar producto");
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
      toast.success("Producto eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      toast.error("Error al eliminar producto");
    } finally {
      setConfirmOpen(false);
      setSelectedProduct(null);
      setLoadingDelete(false);
    }
  };

  return (
    <Box p={3}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexDirection={isMobile ? "column" : "row"}
      >
        <Typography variant={isMobile ? "h6" : "h4"} fontWeight="bold" color="primary" mb={isMobile ? 2 : 0}>
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
            ),
          }}
        />
      </Paper>

      {/* Contenido */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="300px">
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          {isMobile ? (
            // 📱 Cards en móvil
            <Box display="flex" flexDirection="column" gap={2}>
              {filteredProductos.map((prod) => (
                <Paper key={prod._id} sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {prod.nombre}
                  </Typography>
                  {prod.stock !== undefined && (
                    <Typography variant="body2">Stock: {prod.stock}</Typography>
                  )}
                  {prod.precioConsumidorFinal !== undefined && (
                    <Typography variant="body2">Precio consumidor: ${prod.precioConsumidorFinal}</Typography>
                  )}
                  {prod.precioRevendedor !== undefined && (
                    <Typography variant="body2">Precio revendedor: ${prod.precioRevendedor}</Typography>
                  )}
                  <Box display="flex" justifyContent="flex-end" mt={1}>
                    <IconButton onClick={() => handleEditOpen(prod)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(prod)} color="error">
                      <Delete />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
            </Box>
          ) : (
            // 💻 Tabla en escritorio
            <Paper sx={{ overflowX: "auto" }}>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
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
                    {filteredProductos.map((prod) => (
                      <TableRow key={prod._id} hover>
                        <TableCell sx={{ p: 1.5 }}>{prod.nombre}</TableCell>
                        <TableCell sx={{ p: 1.5 }}>{prod.costo}</TableCell>
                        <TableCell sx={{ p: 1.5 }}>{prod.precioConsumidorFinal}</TableCell>
                        <TableCell sx={{ p: 1.5 }}>{prod.precioRevendedor}</TableCell>
                        <TableCell sx={{ p: 1.5 }}>{prod.stock}</TableCell>
                        <TableCell sx={{ p: 1.5 }}>
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
              </TableContainer>
            </Paper>
          )}
        </>
      )}

      {/* Dialog crear */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
        <DialogTitle>Agregar Producto</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {["nombre", "costo", "precioConsumidorFinal", "precioRevendedor", "stock"].map((field) => (
            <TextField
              key={field}
              label={
                field === "precioConsumidorFinal"
                  ? "Precio Consumidor"
                  : field === "precioRevendedor"
                  ? "Precio Revendedor"
                  : field.charAt(0).toUpperCase() + field.slice(1)
              }
              name={field}
              type={["costo", "precioConsumidorFinal", "precioRevendedor", "stock"].includes(field) ? "number" : "text"}
              value={form[field]}
              onChange={handleChange}
              fullWidth
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)} disabled={loadingCreate}>
            Cancelar
          </Button>
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
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {["nombre", "costo", "precioConsumidorFinal", "precioRevendedor", "stock"].map((field) => (
            <TextField
              key={field}
              label={
                field === "precioConsumidorFinal"
                  ? "Precio Consumidor"
                  : field === "precioRevendedor"
                  ? "Precio Revendedor"
                  : field.charAt(0).toUpperCase() + field.slice(1)
              }
              name={field}
              type={["costo", "precioConsumidorFinal", "precioRevendedor", "stock"].includes(field) ? "number" : "text"}
              value={form[field]}
              onChange={handleChange}
              fullWidth
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} disabled={loadingEdit}>
            Cancelar
          </Button>
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
