import React, { useState } from 'react';
import { TextField, Button, MenuItem, Box } from '@mui/material';

const ClienteForm = ({ onSubmit, initialData = {}, buttonLabel = "Guardar" }) => {
  const [formData, setFormData] = useState({
    nombre: initialData.nombre || '',
    tipo: initialData.tipo || '',
    telefono: initialData.telefono || '',
    ubicacion: initialData.ubicacion || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField name="nombre" label="Nombre" value={formData.nombre} onChange={handleChange} required />
      <TextField select name="tipo" label="Tipo de Cliente" value={formData.tipo} onChange={handleChange} required>
        <MenuItem value="revendedor">Revendedor</MenuItem>
        <MenuItem value="consumidor_final">Consumidor Final</MenuItem>
      </TextField>
      <TextField name="telefono" label="Teléfono" value={formData.telefono} onChange={handleChange} />
      <TextField name="ubicacion" label="Ubicación" value={formData.ubicacion} onChange={handleChange} />
      <Button type="submit" variant="contained">{buttonLabel}</Button>
    </Box>
  );
};

export default ClienteForm;
