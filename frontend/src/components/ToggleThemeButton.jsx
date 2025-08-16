// src/components/ToggleThemeButton.jsx
import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeContext } from '../context/ThemeContext';

const ToggleThemeButton = () => {
  const { mode, toggleMode } = useThemeContext();

  return (
    <Tooltip title="Cambiar modo claro/oscuro">
      <IconButton onClick={toggleMode} color="inherit">
        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
};

export default ToggleThemeButton;
