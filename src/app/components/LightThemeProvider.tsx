'use client';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppAppBar from './AppAppBar';
import { PaletteMode } from '@mui/material';

export default function LightThemeProvider({ children }) {
  const [mode, setMode] = React.useState<PaletteMode>('light');
  const theme = createTheme({ palette: { mode } });

  const toggleColorMode = () => {
    setMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      {React.Children.map(children, child => {
        // Checking isValidElement is the safe way and avoids a
        // typescript error too.
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { theme });
        }
        return child;
      })}
    </ThemeProvider>
  );
}
