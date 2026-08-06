import { createTheme } from '@mui/material/styles';

export const getMuiTheme = (mode = 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#6366f1',
        light: '#818cf8',
        dark: '#4f46e5',
      },
      secondary: {
        main: '#ec4899',
      },
      background: {
        default: mode === 'dark' ? '#0f172a' : '#f8fafc',
        paper: mode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#f8fafc' : '#0f172a',
        secondary: mode === 'dark' ? '#94a3b8' : '#64748b',
      },
    },
    typography: {
      fontFamily: ['Inter', 'sans-serif'].join(','),
    },
    shape: {
      borderRadius: 12,
    },
  });
