import {  Theme, createStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import {theme} from './base';


export const StoreTimeStyles = makeStyles({
  container: {
      display: 'flex',
      flexWrap: 'wrap',
  },
  textField: {
      // marginLeft: theme.spacing(1),
      // marginRight: theme.spacing(1),
      width: '100%',
  },
  paper: {
      // padding: theme.spacing(2),
      marginTop: 20,
      textAlign: 'left',
      background: '#fefefe',
      color: theme.palette.text.secondary,
      boxShadow: 'none'
  },
  button: {
      marginTop: 50,
      padding: theme.spacing(2),
      width: '100%',
      fontSize: 16,
      fontWeight: 'bold'
  },
  pointTxt: {
      color: theme.palette.primary.main
  }
});