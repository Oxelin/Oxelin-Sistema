// Layout.jsx
import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function Layout({ sidebarWidth, isMobile }) {
  return (
    <Box
  component="main"
  sx={{
    flexGrow: 1,
    p: 3,
    backgroundColor: "background.default",
    minHeight: "100vh",
    transition: "margin-left 0.3s ease",
  }}
>
  <Outlet />
</Box>
  );
}
