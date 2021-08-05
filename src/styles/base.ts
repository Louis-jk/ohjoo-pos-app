import * as React from 'react';
import { styled, makeStyles } from '@material-ui/styles';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { Box, Button } from '@material-ui/core';

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    primary: {
      light: '#c490be',
      main: '#93628e',
      dark: '#643761',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ffffff',
      main: '#f3e7d7',
      dark: '#c0b5a6',
      contrastText: '#222',
    },
  },
  
});

export const MainBox = styled(Box)({
  padding: theme.spacing(3),
  marginTop: 35,
  [theme.breakpoints.up('sm')]: {
    marginTop: 65,
    marginLeft: 200,
    // backgroundColor: theme.palette.primary.main,
  },
});

export const LoginContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
  height: '100vh',
  backgroundColor: '#fff',
  '& .wrap': {
    minWidth: 250,
    width: '30%'
  }
})

export const MyButton = styled(Button)({
  background: 'linear-gradient(45deg, #fdd835 30%, #fbc02d 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: '#222',
  height: 48,
  padding: '0 30px'
});

export const ModalConfirmButton = styled(Button)({
  backgroundColor: theme.palette.primary.main,
  borderRadius: 3,
  color: theme.palette.primary.contrastText,
  width: 150,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: 'none'
  },
  '&:active': {
    boxShadow: 'none'
  }
});

export const ModalCancelButton = styled(Button)({
  backgroundColor: '#ececec',
  borderRadius: 3,
  color: '#222',
  width: 150,
  boxShadow: 'none',

  '&:hover': {
    backgroundColor: '#d6d6d6',
    borderColor: '#d6d6d6',
    boxShadow: 'none',
  },
  '&:active': {
    backgroundColor: '#c5c5c5',
    borderColor: '#c5c5c5',
    boxShadow: 'none',
  }
});

export const baseStyles = makeStyles({
  root: {
    '& a': {
      textDecoration: 'none'
    },
    '& ul': {
      listStyle: 'none',
    },
    '& li': {
      padding: 0
    }
  },
  loginInput: {
    width: '100%',
    backgroundColor: '#fff',
    marginBottom: 20,
    boxShadow: 'none'
  },
  loadingWrap: {
    display: 'flex', 
    flex: 1, 
    height: '100vh', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  flexRowStartCenter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  flexRowBetweenCenter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  rowCenter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colCenter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alert: {
    position: 'absolute',
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalInner: {
    position: 'relative',
    textAlign: 'center',
    backgroundColor: theme.palette.background.paper,
    border: 'none',
    borderRadius: 5,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(3, 2, 3),
  },
  modalTitle: {
    fontSize: '1.6rem',
    fontWeight: 'bold', 
    color: theme.palette.primary.main,
    marginBottom: 10,
    marginTop: 0
  },
  modalDescription: {
    marginBottom: 20,
  },
  formControl: {
    minWidth: 120,
  },
  multiTxtField: {
    fontSize: 30,
    lineHeight: 30
  },
  fieldMargin: {
    marginBottom: 20
  },
  w100: {
    width: '100%' 
  },
  mt10: {
    marginTop: 10
  },
  mt20: {
    marginTop: 20
  },
  mt30: {
    marginTop: 30
  },
  mt40: {
    marginTop: 40
  },
  mt50: {
    marginTop: 50
  },
  mb05: {
    marginBottom: 5
  },
  mb10: {
    marginBottom: 10
  },
  mb20: {
    marginBottom: 20
  },
  mb30: {
    marginBottom: 30
  },
  mb40: {
    marginBottom: 40
  },
  mb50: {
    marginBottom: 50
  },
  mr10: {
    marginRight: 10
  },
  mr20: {
    marginRight: 20
  },
  mr30: {
    marginRight: 30
  },
  mr40: {
    marginRight: 40
  },
  mr50: {
    marginRight: 50
  },
  ml10: {
    marginLeft: 10
  },
  ml20: {
    marginLeft: 20
  },
  ml30: {
    marginLeft: 30
  },
  ml40: {
    marginLeft: 40
  },
  ml50: {
    marginLeft: 50
  },
  commantWrap: {
    borderRadius: 5,
    backgroundColor: '#ececec',
    padding: 30,
    color: '#222'
  },
  txtRoot: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textField: {
    backgroundColor: '#fff',
    marginBottom: 10
  },
  boxBlur: {
    boxShadow: '0px 0px 10px 0px #e5e5e5',
  },
  gradient: {
    background: "linear-gradient(45deg, #D5ECC2, #EDF6E5, #FFF5DA)"
  },
  border: {
    borderWidth: 1,
    borderColor: '#e3e3e3',
  },
  margin: {
    margin: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    // boxShadow: '0px 0px 10px 0px #e5e5e5',
    boxShadow: 'none',
    background: 'transparent'
  },
  reviewPaper: {
    padding: theme.spacing(3),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginBottom: 30,
    backgroundColor: '#fff',
    boxShadow: '0px 0px 10px 2px #e3e3e3'
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  title: {
    flexDirection: 'row',
    color: '#222'
  },
  reviewContent: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    minWidth: 500,
    minHeight: 100,
    fontSize: 14,
    lineHeight: 2,
    padding: 20,
    borderRadius: 5,
    backgroundColor: '#ececec',
  },
  reviewMultiTxtField: {
    fontSize: 30,
    lineHeight: 100
  },
  confirmBtn: {
    minWidth: 150,
    height: 50,
    boxShadow: 'none'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginTop: 60,
    '& a': {
      textDecoration: 'none'
    }
  },
  alertStyle: {
    position: 'absolute',
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
});