import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Avatar,
  Divider,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  format,
  isToday,
  parseISO,
  isThisWeek,
  isThisMonth,
} from "date-fns";
import axios from "axios";

// Iconos MUI
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Dashboard = () => {
  const [ventas, setVentas] = useState([]);
  const [remitosHoy, setRemitosHoy] = useState(0);
  const [ventasHoy, setVentasHoy] = useState(0);
  const [ventasMensuales, setVentasMensuales] = useState([]);
  const [productosSemana, setProductosSemana] = useState([]);
  const [productosMes, setProductosMes] = useState([]);
  const [productosTotales, setProductosTotales] = useState([]);
  const [clientesTop, setClientesTop] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000/api/remitos";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API_URL);
        const data = res.data;
        setVentas(data);

        const hoy = data.filter((r) => isToday(parseISO(r.fecha)));
        setRemitosHoy(hoy.length);
        setVentasHoy(hoy.reduce((acc, r) => acc + r.total, 0));

        // Agrupar ventas mensuales
        const grouped = {};
        data.forEach((venta) => {
          const month = format(parseISO(venta.fecha), "MMM");
          if (!grouped[month]) {
            grouped[month] = { mes: month, "Consumidor Final": 0, Revendedor: 0 };
          }
          if (venta.tipoCliente === "Consumidor Final") {
            grouped[month]["Consumidor Final"] += venta.total;
          } else if (venta.tipoCliente === "Revendedor") {
            grouped[month].Revendedor += venta.total;
          }
        });
        setVentasMensuales(Object.values(grouped));

        // Contar productos
        const contarProductos = (ventasFiltradas) => {
          const contador = {};
          ventasFiltradas.forEach((v) => {
            v.productos.forEach((p) => {
              const nombre = p.producto?.nombre || "Desconocido";
              contador[nombre] = (contador[nombre] || 0) + p.cantidad;
            });
          });
          return Object.entries(contador)
            .map(([nombre, cantidad]) => ({ nombre, cantidad }))
            .sort((a, b) => b.cantidad - a.cantidad)
            .slice(0, 5);
        };

        setProductosSemana(contarProductos(data.filter((v) => isThisWeek(parseISO(v.fecha)))));
        setProductosMes(contarProductos(data.filter((v) => isThisMonth(parseISO(v.fecha)))));
        setProductosTotales(contarProductos(data));

        // Clientes top
        const contadorClientes = {};
        data.forEach((v) => {
          const cliente = v.cliente?.nombre || "Desconocido";
          contadorClientes[cliente] = (contadorClientes[cliente] || 0) + v.total;
        });
        setClientesTop(
          Object.entries(contadorClientes)
            .map(([nombre, total]) => ({ nombre, total }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5)
        );

        setLoading(false);
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28", "#AA336A"];

  const ventasPorTipo = [
    {
      name: "Consumidor Final",
      value: ventas.filter((v) => v.tipoCliente === "Consumidor Final")
        .reduce((acc, v) => acc + v.total, 0),
    },
    {
      name: "Revendedor",
      value: ventas.filter((v) => v.tipoCliente === "Revendedor")
        .reduce((acc, v) => acc + v.total, 0),
    },
  ];

  const MetricCard = ({ title, value, icon, color }) => (
    <Paper sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
      <Avatar sx={{ bgcolor: color }}>{icon}</Avatar>
      <Box>
        <Typography variant="subtitle2" color="textSecondary">{title}</Typography>
        <Typography variant="h5">{value}</Typography>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          📊 Panel de Control
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            {/* Métricas principales */}
            <Grid container spacing={2} mb={4}>
              <Grid item xs={12} sm={4}>
                <MetricCard
                  title="Remitos de Hoy"
                  value={remitosHoy}
                  icon={<AssignmentTurnedInIcon />}
                  color="#1976d2"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <MetricCard
                  title="Ventas de Hoy"
                  value={`$${ventasHoy.toLocaleString()}`}
                  icon={<AttachMoneyIcon />}
                  color="#2e7d32"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <MetricCard
                  title="Total Ventas"
                  value={`$${ventas.reduce((acc, v) => acc + v.total, 0).toLocaleString()}`}
                  icon={<AssessmentIcon />}
                  color="#ed6c02"
                />
              </Grid>
            </Grid>

            {/* Gráfico Ventas Mensuales */}
            <Paper sx={{ p: 2, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Ventas Mensuales por Tipo de Cliente
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ventasMensuales}>
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Consumidor Final" fill="#0088FE" />
                  <Bar dataKey="Revendedor" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>

            {/* Gráfico de Proporción */}
            <Paper sx={{ p: 2, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Proporción de Ventas por Tipo de Cliente
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ventasPorTipo}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {ventasPorTipo.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>

            {/* Productos más vendidos */}
            <Grid container spacing={2}>
              {[
                { titulo: "Semana", data: productosSemana },
                { titulo: "Mes", data: productosMes },
                { titulo: "Histórico", data: productosTotales },
              ].map((grupo, idx) => (
                <Grid item xs={12} md={4} key={idx}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      <ShoppingCartIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                      Productos más vendidos ({grupo.titulo})
                    </Typography>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={grupo.data}>
                        <XAxis dataKey="nombre" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="cantidad" fill={COLORS[idx]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Clientes top */}
            <Paper sx={{ p: 2, mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Clientes con más compras (Histórico)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={clientesTop}>
                  <XAxis dataKey="nombre" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
