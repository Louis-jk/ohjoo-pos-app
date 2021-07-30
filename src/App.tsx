import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { theme } from './styles/base';
import Routes from './routes';

function App() {
  return (

    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes />
    </ThemeProvider>

  );
}

export default App;
