import React from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

function Login() {
  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Iniciar sesión
      </Typography>
      <Box component="form" sx={{ mt: 2 }}>
        <TextField fullWidth label="Correo" margin="normal" />
        <TextField fullWidth label="Contraseña" type="password" margin="normal" />
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Ingresar
        </Button>
      </Box>
    </Container>
  );
}

export default Login;
