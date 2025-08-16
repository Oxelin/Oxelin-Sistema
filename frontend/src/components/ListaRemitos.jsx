import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, Grid,
  FormControl, InputLabel, Select, MenuItem,
  Button, TableContainer, Table, TableHead, TextField,
  TableRow, TableCell, TableBody, IconButton, Tooltip, InputAdornment, Dialog,
  DialogActions, DialogTitle, Collapse, Pagination, CircularProgress
} from '@mui/material';
import { obtenerRemitos, eliminarRemito } from '../services/remitoService';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from '@mui/icons-material/Search';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify';
import { format, parseISO } from 'date-fns';
import oxelinLogo from '../assets/hero.png';

const ListaRemitos = () => {
  const [remitos, setRemitos] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [openRows, setOpenRows] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null });
  const [paginaActual, setPaginaActual] = useState(1);
  const [loading, setLoading] = useState(true);          // 🟢 estado de carga general
  const [loadingDelete, setLoadingDelete] = useState(false); // 🟢 estado de eliminación
  const remitosPorPagina = 5;

  useEffect(() => {
    const fetchRemitos = async () => {
      try {
        setLoading(true);
        const res = await obtenerRemitos();
        setRemitos(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Error al obtener remitos');
      } finally {
        setLoading(false);
      }
    };
    fetchRemitos();
  }, []);

  const extensible = (id) => setOpenRows(prev => ({ ...prev, [id]: !prev[id] }));

  const filtrarRemitos = () => {
    return remitos.filter(r => {
      const matchTipo = filtroTipo ? r.tipoPrecio === filtroTipo : true;
      const matchFecha = filtroFecha
        ? format(new Date(r.fecha), 'yyyy-MM') === filtroFecha
        : true;
      const matchBusqueda = busqueda.trim() === '' ||
        r.cliente?.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        r.productos.some(p => p.producto?.nombre?.toLowerCase().includes(busqueda.toLowerCase()));
      return matchTipo && matchFecha && matchBusqueda;
    });
  };

  const calcularTotales = (lista) => {
    return lista.reduce((acc, r) => {
      acc[r.tipoPrecio] = (acc[r.tipoPrecio] || 0) + r.productos.reduce((s, i) => s + i.subtotal, 0);
      return acc;
    }, {});
  };

  const formatearTipoPrecio = (tipo) => {
    switch (tipo) {
      case 'costo': return 'Costo';
      case 'precioConsumidorFinal': return 'Consumidor Final';
      case 'precioRevendedor': return 'Revendedor';
      default: return tipo;
    }
  };

  const remitosFiltrados = filtrarRemitos();
  const totales = calcularTotales(remitosFiltrados);
  const totalPaginas = Math.ceil(remitosFiltrados.length / remitosPorPagina);
  const remitosPaginados = remitosFiltrados.slice(
    (paginaActual - 1) * remitosPorPagina,
    paginaActual * remitosPorPagina
  );

  const confirmarEliminar = (id) => {
    setConfirmDialog({ open: true, id });
  };

  const handleEliminarConfirmado = async () => {
    try {
      setLoadingDelete(true);
      await eliminarRemito(confirmDialog.id);
      setRemitos(prev => prev.filter(r => r._id !== confirmDialog.id));
      toast.success('Remito eliminado correctamente');
      setConfirmDialog({ open: false, id: null });
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar remito');
      setConfirmDialog({ open: false, id: null });
    } finally {
      setLoadingDelete(false);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Remitos', 14, 15);
    const headers = [['Cliente', 'Tipo', 'Fecha', 'Total']];
    const rows = remitosFiltrados.map(r => [
      r.cliente?.nombre ?? 'Cliente desconocido',
      formatearTipoPrecio(r.tipoPrecio),
      format(parseISO(r.fecha), 'dd/MM/yyyy'),
      r.productos.reduce((s, i) => s + i.subtotal, 0)
    ]);
    doc.autoTable({ head: headers, body: rows, startY: 20 });
    doc.save('remitos.pdf');
  };

  const exportRemitoPDF = (remito) => {
    const doc = new jsPDF();
    doc.addImage(oxelinLogo, 'PNG', 14, 10, 30, 30);
    doc.setFontSize(18);
    doc.text('OXELIN - Remito', 50, 20);
    doc.setFontSize(12);
    doc.text(`Cliente: ${remito.cliente?.nombre ?? 'Cliente desconocido'}`, 14, 50);
    doc.text(`Fecha: ${format(parseISO(remito.fecha), 'dd/MM/yyyy')}`, 14, 58);
    doc.text(`Tipo: ${formatearTipoPrecio(remito.tipoPrecio)}`, 14, 66);

    const headers = [['Producto', 'Cantidad', 'Precio Unit.', 'Subtotal']];
    const rows = remito.productos.map(i => [
      i.producto?.nombre ?? 'Producto desconocido',
      i.cantidad,
      `$${(i.subtotal / i.cantidad).toFixed(2)}`,
      `$${i.subtotal.toFixed(2)}`
    ]);
    doc.autoTable({ head: headers, body: rows, startY: 75 });

    const total = remito.productos.reduce((s, i) => s + i.subtotal, 0);
    doc.setFontSize(14);
    doc.text(`Total: $${total.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 15);

    doc.save(`remito_${remito._id}.pdf`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      <Paper sx={{ p: 3, mb: 3, width: '100%' }} elevation={3}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Lista de Remitos
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={filtroTipo}
                onChange={e => setFiltroTipo(e.target.value)}
                label="Tipo"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="costo">Costo</MenuItem>
                <MenuItem value="precioConsumidorFinal">Consumidor Final</MenuItem>
                <MenuItem value="precioRevendedor">Revendedor</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              type="month"
              fullWidth
              label="Mes/Año"
              InputLabelProps={{ shrink: true }}
              value={filtroFecha}
              onChange={e => setFiltroFecha(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Buscar por cliente o producto"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={exportPDF}
              sx={{ height: '100%' }}
            >
              PDF
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
        <Typography variant="h6" gutterBottom>Totales</Typography>
        <Grid container spacing={2}>
          {Object.entries(totales).map(([tipo, monto]) => (
            <Grid key={tipo} item xs={12} sm={4}>
              <Paper sx={{ p: 2, bgcolor: '#f9f9f9' }}>
                <Typography variant="subtitle2">{formatearTipoPrecio(tipo)}</Typography>
                <Typography variant="h6" fontWeight="bold">
                  ${monto.toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ background: '#f0f0f0' }}>
            <TableRow>
              <TableCell />
              <TableCell>Cliente</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {remitosPaginados.map(r => {
              const total = r.productos.reduce((s, i) => s + i.subtotal, 0);
              return (
                <React.Fragment key={r._id}>
                  <TableRow hover>
                    <TableCell>
                      <Tooltip title="Ver productos">
                        <IconButton size="small" onClick={() => extensible(r._id)}>
                          {openRows[r._id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{r.cliente?.nombre ?? 'Cliente desconocido'}</TableCell>
                    <TableCell>{formatearTipoPrecio(r.tipoPrecio)}</TableCell>
                    <TableCell>{format(parseISO(r.fecha), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>${total.toLocaleString()}</TableCell>
                    <TableCell>
                      <Tooltip title="Imprimir">
                        <IconButton color="primary" onClick={() => exportRemitoPDF(r)}>
                          <PrintIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Eliminar">
                        <span>
                          <IconButton
                            color="error"
                            onClick={() => confirmarEliminar(r._id)}
                            disabled={loadingDelete}
                          >
                            {loadingDelete && confirmDialog.id === r._id
                              ? <CircularProgress size={20} color="inherit" />
                              : <DeleteIcon />}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={6} sx={{ p: 0 }}>
                      <Collapse in={openRows[r._id]} timeout="auto" unmountOnExit>
                        <Box sx={{ background: '#f5f5f5', px: 3, py: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>Productos:</Typography>
                          {r.productos.map((i, idx) => (
                            <Typography key={idx} variant="body2" sx={{ pl: 2 }}>
                              {`${i.producto?.nombre ?? 'Producto desconocido'} — Cant: ${i.cantidad} — Subtotal: $${i.subtotal}`}
                            </Typography>
                          ))}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPaginas}
            page={paginaActual}
            onChange={(e, val) => setPaginaActual(val)}
            color="primary"
          />
        </Box>
      </TableContainer>

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, id: null })}
      >
        <DialogTitle>¿Estás seguro de eliminar este remito?</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ open: false, id: null })}
            variant="outlined"
            disabled={loadingDelete}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleEliminarConfirmado}
            color="error"
            variant="contained"
            disabled={loadingDelete}
          >
            {loadingDelete ? <CircularProgress size={20} color="inherit" /> : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListaRemitos;
