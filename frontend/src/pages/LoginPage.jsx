import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const success = await login(form.username, form.password);
    setLoading(false);
    if (success) navigate('/');
    else setError('Credenciales incorrectas');
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%' }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            background: 'linear-gradient(145deg, #f5f5f5, #e0e0e0)',
          }}
        >
          {/* Logo */}
          <Box display="flex" justifyContent="center" mb={3}>
            <img
              src="/hero.png"
              alt="OXELIN Logo"
              style={{ width: '150px', height: 'auto' }}
            />
          </Box>

          <Typography
            variant="h5"
            align="center"
            gutterBottom
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Iniciar Sesión
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Usuario"
              name="username"
              value={form.username}
              onChange={handleChange}
              variant="outlined"
              autoFocus
            />
            <TextField
              fullWidth
              margin="normal"
              label="Contraseña"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              variant="outlined"
            />
            <Box position="relative" mt={3}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  background:
                    'linear-gradient(90deg, #1976d2, #42a5f5)',
                }}
              >
                Entrar
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: 'primary.main',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              )}
            </Box>
          </form>

          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 3, color: 'text.secondary' }}
          >
            © {new Date().getFullYear()} OXELIN
          </Typography>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default LoginPage;
