// LayoutWrapper.jsx
import React, { useState, useEffect } from "react";
import { Box, useMediaQuery, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Sidebar from "./Sidebar";
import Layout from "./Layout";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 240;
const collapsedWidth = 60;

export default function LayoutWrapper() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(!isMobile);

  // actualizar estado open si cambia el tamaño de pantalla
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} isMobile={isMobile} />

      {/* Botón flotante móvil */}
      {isMobile && !open && (
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: 1300,
            backgroundColor: "#1e1e2f",
            color: "#fff",
            "&:hover": { backgroundColor: "#2a2a40" },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Contenido principal */}
      <Layout
        sidebarWidth={open ? drawerWidth : collapsedWidth}
        isMobile={isMobile}
      />
    </Box>
  );
}
