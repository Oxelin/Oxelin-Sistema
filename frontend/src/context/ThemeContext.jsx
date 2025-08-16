// src/context/ThemeContext.jsx
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  useEffect(() => {
    const storedMode = localStorage.getItem('themeMode');
    if (storedMode === 'light' || storedMode === 'dark') {
      setMode(storedMode);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode,
        ...(mode === 'light'
          ? {
              primary: {
                main: '#2563eb', // azul
              },
              secondary: {
                main: '#38bdf8', // celeste
              },
              background: {
                default: '#f0f9ff',
                paper: '#ffffff',
                sidebar: '#ffffff',
                sidebarText: '#0f172a',
              },
              text: {
                primary: '#0f172a',
                secondary: '#334155',
              },
            }
          : {
              primary: {
                main: '#60a5fa', // azul suave
              },
              secondary: {
                main: '#7dd3fc', // celeste
              },
              background: {
                default: '#0f172a',
                paper: '#1e293b',
                sidebar: '#1e293b', // fondo sidebar
                sidebarText: '#e2e8f0', // texto sidebar
              },
              text: {
                primary: '#e2e8f0',
                secondary: '#94a3b8',
              },
            }),
      },
      components: {
        MuiDrawer: {
          styleOverrides: {
            paper: {
              backgroundImage: 'none',
            },
          },
        },
        MuiListItem: {
          styleOverrides: {
            root: {
              borderRadius: 6,
              margin: '4px 8px',
            },
          },
        },
      },
    }),
  [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
