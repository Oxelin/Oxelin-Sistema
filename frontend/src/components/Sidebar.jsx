// src/components/Sidebar.jsx
import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Divider,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"; // <- Icono $
import ReceiptIcon from "@mui/icons-material/Receipt";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 240;
const collapsedWidth = 60;

export default function Sidebar({ open, setOpen, isMobile }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Productos", icon: <InventoryIcon />, path: "/productos" },
    { text: "Clientes", icon: <PeopleIcon />, path: "/clientes" },
    { text: "Remitos", icon: <AttachMoneyIcon />, path: "/remitos" }, // <- cambiado
    { text: "Lista de remitos", icon: <ReceiptIcon />, path: "/lista-remitos" }, // <- cambiado
  ];

  const drawerContent = (
    <>
      {/* Header con logo y toggle */}
      <Toolbar
        sx={{
          display: "flex",
          flexDirection: open ? "row" : "column",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          px: 1,
          py: 2,
          gap: open ? 0 : 1.5,
        }}
      >
        {/* Logo solo cuando está expandido */}
        {open && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexGrow: 1,
            }}
          >
            <Box
              component="img"
              src="/hero.png"
              alt="Logo"
              sx={{
                width: 50,
                height: 50,
                borderRadius: "8px",
                objectFit: "contain",
                transition: "all 0.3s ease",
              }}
            />
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#fff", whiteSpace: "nowrap" }}
            >
              OXELIN
            </Typography>
          </Box>
        )}

        {/* Toggle button */}
        {!isMobile && (
          <IconButton
            onClick={() => setOpen(!open)}
            sx={{
              color: "#fff",
              backgroundColor: "#2a2a40",
              "&:hover": { backgroundColor: "#4f46e5" },
              transition: "all 0.3s ease",
            }}
            size="small"
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      {/* Lista de opciones */}
      <Box sx={{ overflow: "auto", mt: 1 }}>
        <List>
          {menuItems.map((item) => {
            const listItem = (
              <ListItemButton
                key={item.text}
                selected={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#4f46e5",
                    "&:hover": { backgroundColor: "#4338ca" },
                  },
                  "&:hover": { backgroundColor: "#2a2a40" },
                  justifyContent: open ? "flex-start" : "center",
                  px: open ? 2 : 0,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "#fff",
                    minWidth: open ? 40 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {open && <ListItemText primary={item.text} />}
              </ListItemButton>
            );

            // Tooltip solo si está colapsado
            return open ? (
              listItem
            ) : (
              <Tooltip title={item.text} placement="right" arrow key={item.text}>
                {listItem}
              </Tooltip>
            );
          })}

          {/* Cerrar sesión */}
          {open ? (
            <ListItemButton
              onClick={() => console.log("Cerrar sesión")}
              sx={{
                mt: 4,
                "&:hover": { backgroundColor: "#dc2626" },
                justifyContent: "flex-start",
                px: 2,
              }}
            >
              <ListItemIcon
                sx={{
                  color: "#fff",
                  minWidth: 40,
                  justifyContent: "center",
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Cerrar sesión" />
            </ListItemButton>
          ) : (
            <Tooltip title="Cerrar sesión" placement="right" arrow>
              <ListItemButton
                onClick={() => console.log("Cerrar sesión")}
                sx={{
                  mt: 4,
                  "&:hover": { backgroundColor: "#dc2626" },
                  justifyContent: "center",
                  px: 0,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "#fff",
                    justifyContent: "center",
                  }}
                >
                  <LogoutIcon />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          )}
        </List>
      </Box>
    </>
  );

  return (
    <>
      {/* Desktop */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: open ? drawerWidth : collapsedWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: open ? drawerWidth : collapsedWidth,
              boxSizing: "border-box",
              backgroundColor: "#1e1e2f",
              color: "#fff",
              transition: "width 0.3s",
              overflowX: "hidden",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Mobile */}
      {isMobile && (
        <>
          <IconButton
            onClick={() => setMobileOpen(true)}
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
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                backgroundColor: "#1e1e2f",
                color: "#fff",
              },
            }}
          >
            {drawerContent}
          </Drawer>
        </>
      )}
    </>
  );
}
