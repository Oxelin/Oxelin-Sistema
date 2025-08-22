// src/App.jsx
import { Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProductListPage from "./pages/ProductListPage";
import ClientesPage from "./pages/ClientesPage";
import Remitos from "./pages/Remitos";
import ListaRemitos from "./components/ListaRemitos";
import Costos from "./pages/Costos"; // <- Nueva página

import LayoutWrapper from "./components/LayoutWrapper";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rutas protegidas */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <LayoutWrapper />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="productos" element={<ProductListPage />} />
        <Route path="clientes" element={<ClientesPage />} />
        <Route path="remitos" element={<Remitos />} />
        <Route path="lista-remitos" element={<ListaRemitos />} />
        <Route path="costos" element={<Costos />} /> {/* <- Nueva ruta */}
      </Route>
    </Routes>
  );
}
