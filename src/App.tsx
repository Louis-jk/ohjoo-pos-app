import React from 'react';
import logo from './logo.svg';
import './App.css';
import { MyButton } from './styles/base';
import Header from './components/Header';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from './styles/base';
import Routes from './routes';

function App() {
  return (

    <ThemeProvider theme={theme}>
      <Routes />
    </ThemeProvider>

  );
}

export default App;
