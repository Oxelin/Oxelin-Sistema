import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Autocomplete,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Paper,
  Fade,
  CircularProgress,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import { getClientes } from "../services/clientService";
import { getProductos } from "../services/productService";
import { crearRemito } from "../services/remitoService";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Remitos = () => {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [productosAgregados, setProductosAgregados] = useState([]);
  const [tipoPrecio, setTipoPrecio] = useState("precioConsumidorFinal");
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoadingClientes(true);
        const cli = await getClientes();
        setClientes(cli);
      } catch (err) {
        console.error("Error cargando clientes:", err);
        toast.error("Error cargando clientes.");
      } finally {
        setLoadingClientes(false);
      }
    };

    const fetchProductos = async () => {
      try {
        setLoadingProductos(true);
        const prodResponse = await getProductos();
        const prod = prodResponse.data || [];
        setProductos(prod);
      } catch (err) {
        console.error("Error cargando productos:", err);
        toast.error("Error cargando productos.");
      } finally {
        setLoadingProductos(false);
      }
    };

    fetchClientes();
    fetchProductos();
  }, []);

  useEffect(() => {
    setProductosAgregados((prev) =>
      prev.map((p) => {
        const nuevoPrecio = p[tipoPrecio] ?? 0;
        return {
          ...p,
          precioUnitario: nuevoPrecio,
          subtotal: nuevoPrecio * p.cantidad,
        };
      })
    );
  }, [tipoPrecio]);

  const handleProductoSeleccionado = (e, producto) => {
    if (!producto) return;
    const yaExiste = productosAgregados.some((p) => p._id === producto._id);
    if (yaExiste) {
      toast.info("El producto ya fue agregado.");
      return;
    }
    const precioUnitario = producto[tipoPrecio] ?? 0;
    setProductosAgregados([
      ...productosAgregados,
      {
        ...producto,
        cantidad: 1,
        precioUnitario,
        subtotal: precioUnitario,
      },
    ]);
  };

  const handleCantidadChange = (index, nuevaCantidad) => {
    const nuevos = [...productosAgregados];
    nuevos[index].cantidad = nuevaCantidad;
    nuevos[index].subtotal = nuevos[index].precioUnitario * nuevaCantidad;
    setProductosAgregados(nuevos);
  };

  const handleEliminarProducto = (index) => {
    const nuevos = [...productosAgregados];
    nuevos.splice(index, 1);
    setProductosAgregados(nuevos);
  };

  const handleGuardarRemito = async () => {
    if (!clienteSeleccionado || productosAgregados.length === 0) {
      toast.warn("Selecciona un cliente y al menos un producto.");
      return;
    }
    const remito = {
      cliente: clienteSeleccionado._id,
      tipoPrecio,
      productos: productosAgregados.map((p) => ({
        producto: p._id,
        cantidad: p.cantidad,
        precioUnitario: p.precioUnitario,
      })),
    };
    try {
      setLoadingSave(true);
      await crearRemito(remito);
      toast.success("Remito guardado correctamente.");
      setProductosAgregados([]);
      setClienteSeleccionado(null);
    } catch (err) {
      console.error("Error al guardar remito:", err);
      toast.error("Error guardando remito.");
    } finally {
      setLoadingSave(false);
    }
  };

  const calcularTotal = () =>
    productosAgregados.reduce((sum, p) => sum + p.subtotal, 0);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1200px",
        mx: "auto",
        px: { xs: 1, md: 2 },
        py: 3,
      }}
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(90deg, #1976d2, #1565c0)",
          color: "white",
          p: 3,
          borderRadius: 2,
          mb: 4,
          boxShadow: 2,
        }}
        component={motion.div}
        initial={{ scale: 0.98 }}
        animate={{ scale: 1 }}
      >
        <Typography variant="h5" fontWeight={600}>
          <ShoppingCartIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Crear Remito
        </Typography>
      </Box>

      {/* Cliente */}
      <Box mb={3}>
        <Autocomplete
          fullWidth
          options={clientes}
          getOptionLabel={(option) =>
            `${option.nombre || ""} (${option.tipo || ""})`
          }
          value={clienteSeleccionado}
          onChange={(e, newValue) => setClienteSeleccionado(newValue)}
          loading={loadingClientes}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Seleccionar Cliente"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingClientes ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </Box>

      {/* Tipo de precio */}
      <Box mb={3}>
        <FormControl fullWidth>
          <InputLabel id="tipo-precio-label">Tipo de Precio</InputLabel>
          <Select
            labelId="tipo-precio-label"
            label="Tipo de Precio"
            value={tipoPrecio}
            onChange={(e) => setTipoPrecio(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <PriceChangeIcon />
              </InputAdornment>
            }
          >
            <MenuItem value="costo">Costo</MenuItem>
            <MenuItem value="precioConsumidorFinal">Consumidor Final</MenuItem>
            <MenuItem value="precioRevendedor">Revendedor</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Producto */}
      <Box mb={3}>
        <Autocomplete
          fullWidth
          options={productos}
          getOptionLabel={(option) => option.nombre || ""}
          onChange={handleProductoSeleccionado}
          loading={loadingProductos}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Buscar Producto"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingProductos ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    <ShoppingCartIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </Box>

      {/* Tabla */}
      <Fade in>
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{ borderRadius: 2, mb: 2 }}
        >
          <Table size="small">
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell><b>Producto</b></TableCell>
                <TableCell><b>Cantidad</b></TableCell>
                <TableCell><b>Precio Unitario</b></TableCell>
                <TableCell><b>Subtotal</b></TableCell>
                <TableCell><b>Acciones</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productosAgregados.map((prod, index) => (
                <TableRow key={prod._id}>
                  <TableCell>{prod.nombre}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      variant="outlined"
                      value={prod.cantidad}
                      onChange={(e) =>
                        handleCantidadChange(index, Number(e.target.value))
                      }
                      InputProps={{ inputProps: { min: 1 } }}
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                  <TableCell>
                    ${prod.precioUnitario.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    ${prod.subtotal.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleEliminarProducto(index)}
                      disabled={loadingSave}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {productosAgregados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography
                      color="text.secondary"
                      align="center"
                      sx={{ py: 2 }}
                    >
                      No hay productos agregados.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Fade>

      {/* Total */}
      <Box textAlign="right" mt={2}>
        <Typography variant="h6">
          Total: <b>${calcularTotal().toLocaleString()}</b>
        </Typography>
      </Box>

      {/* Guardar */}
      <Box textAlign="right" mt={3}>
        <Button
          variant="contained"
          color="primary"
          startIcon={loadingSave ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          onClick={handleGuardarRemito}
          sx={{ borderRadius: 2, px: 3, py: 1.2 }}
          disabled={loadingSave}
        >
          {loadingSave ? "Guardando..." : "Guardar Remito"}
        </Button>
      </Box>
    </Box>
  );
};

export default Remitos;
