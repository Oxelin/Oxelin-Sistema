import React, { useEffect, useState } from 'react';
import { getProductos, crearProducto, actualizarProducto, eliminarProducto } from '../services/productService';
import { TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent } from '@mui/material';

const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ nombre: '', costo: '', precioConsumidorFinal: '', precioRevendedor: '', stock: '' });
  const [editando, setEditando] = useState(null);
  const [open, setOpen] = useState(false);

  const cargarProductos = async () => {
    const res = await getProductos();
    setProductos(res.data);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (editando) {
      await actualizarProducto(editando._id, form);
    } else {
      await crearProducto(form);
    }
    setForm({ nombre: '', costo: '', precioConsumidorFinal: '', precioRevendedor: '', stock: '' });
    setEditando(null);
    setOpen(false);
    cargarProductos();
  };

  const handleEditar = producto => {
    setForm(producto);
    setEditando(producto);
    setOpen(true);
  };

  const handleEliminar = async (id) => {
    await eliminarProducto(id);
    cargarProductos();
  };

  return (
    <div>
      <h2>Gestión de Productos</h2>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>Nuevo Producto</Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editando ? 'Editar' : 'Nuevo'} Producto</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Costo" name="costo" type="number" value={form.costo} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Precio Consumidor" name="precioConsumidorFinal" type="number" value={form.precioConsumidorFinal} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Precio Revendedor" name="precioRevendedor" type="number" value={form.precioRevendedor} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange} />
          <Button onClick={handleSubmit} variant="contained" sx={{ mt: 2 }}>{editando ? 'Actualizar' : 'Crear'}</Button>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Consumidor Final</TableCell>
            <TableCell>Revendedor</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productos.map(prod => (
            <TableRow key={prod._id}>
              <TableCell>{prod.nombre}</TableCell>
              <TableCell>${prod.precioConsumidorFinal}</TableCell>
              <TableCell>${prod.precioRevendedor}</TableCell>
              <TableCell>{prod.stock}</TableCell>
              <TableCell>
                <Button onClick={() => handleEditar(prod)} color="primary">Editar</Button>
                <Button onClick={() => handleEliminar(prod._id)} color="error">Eliminar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminProductos;
