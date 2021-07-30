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

export const MenuStyles = makeStyles({
  menuListPaper: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    backgroundColor: '#fff',
    boxShadow: '0px 0px 10px 2px #e3e3e3'
  },
  menuListWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    color: '#222'
  },
  menuListTextWrap: {
    display: 'flex',
    flex: 1,
    height: 120,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    margin: 0
  },
  menuListTitle: {
    display: 'flex',
    flexDirection: 'row',
    fontWeight: 'bold',
    color: '#222'
  },
  menuListCategory: {
    marginRight: 5,
    color: '#222'
  },
  menuListLabel01: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,

    '& p': {
      background: theme.palette.primary.main,
      borderRadius: 2,
      fontSize: 12,
      color: theme.palette.primary.contrastText,
      padding: 2,
      paddingRight: 5,
      paddingLeft: 5
    }
  },
  menuListLabel02: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,

    '& p': {
      background: theme.palette.secondary.main,
      borderRadius: 2,
      fontSize: 12,
      color: theme.palette.secondary.contrastText,
      padding: 2,
      paddingRight: 5,
      paddingLeft: 5,
      margin: 0,
    }
  },
  menuListLabel03: {
    justifyContent: 'center',
    alignItems: 'center',

    '& p': {
      background: '#ececec',
      borderRadius: 2,
      fontSize: 12,
      color: '#999',
      padding: 2,
      paddingRight: 5,
      paddingLeft: 5
    }
  },
  menuListName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  menuListImg: {
    width: 120,
    height: 120,
    borderRadius: 5,
    marginRight: 20,
    objectFit: 'cover'
  },
  menuListPrice: {
    fontSize: 16,
    color: '#222',
    margin: 0
  },
  menuImg: {
    borderRadius: 5,
    width: '100%',
    height: 350,
    objectFit: 'cover'
  },
  menuInput: {
    display: 'none'
  },
  photoSelectIcon: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    margin: 0,
    padding: 0,
    minWidth: 0,

    '& img': {
      width: 35,
      height: 35,
      objectFit: 'cover'
    }
  },
})