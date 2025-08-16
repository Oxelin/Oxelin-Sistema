import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import oxelinLogo from '../assets/hero.png'; // Asegúrate de que el logo esté aquí

const Navbar = () => {
  return (
    <AppBar position="static" color="inherit" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo y título a la izquierda */}
          <Box display="flex" alignItems="center">
            <img
              src={oxelinLogo}
              alt="Oxelin Logo"
              style={{ height: 42, marginRight: 12 }}
            />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                textDecoration: 'none',
                color: '#333',
                fontWeight: 700,
                fontFamily: 'Roboto, sans-serif',
                letterSpacing: 1
              }}
            >
              OXELIN
            </Typography>
          </Box>

          {/* Botones a la derecha */}
          <Box>
            <Button
              component={Link}
              to="/"
              sx={{ color: '#333', fontWeight: 500, mx: 1 }}
            >
              Inicio
            </Button>
            <Button
              component={Link}
              to="/remito"
              sx={{ color: '#333', fontWeight: 500, mx: 1 }}
            >
              Generar Remito
            </Button>
            <Button
              component={Link}
              to="/admin"
              sx={{ color: '#333', fontWeight: 500, mx: 1 }}
            >
              Admin
            </Button>
            <Button
              component={Link}
              to="/login"
              sx={{ color: '#1976d2', fontWeight: 600, mx: 1 }}
            >
              Login
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
