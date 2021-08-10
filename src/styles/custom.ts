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
      height: 50,
      fontSize: 16,
      fontWeight: 'bold'
  },
  pointTxt: {
      color: theme.palette.primary.main
  }
});

export const CouponStyles = makeStyles({
  couponModal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponModalInner: {
    textAlign: 'center',
    backgroundColor: theme.palette.background.paper,
    border: 'none',
    borderRadius: 5,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  couponConfirmBtn: {
    width: 120,
    boxShadow: 'none'
  },
  couponPaper: {
    padding: theme.spacing(3),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    backgroundColor: '#fff',
    boxShadow: '0px 0px 10px 2px #f1f1f1 !important'
  },
  couponBox: {
    position: 'relative',
    padding: 10,
    borderWidth: 2,
    borderStyle: 'dotted',
    borderColor: '#907FA4',
    borderRadius: 5,
    backgroundColor: theme.palette.primary.main,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10
  },
  couponPrice: {
    color: theme.palette.primary.contrastText
  },
  gradient: {
    background: "linear-gradient(45deg, #dfe6ec, #e0f0ea, #FFF5DA)"
  },
})

export const MenuStyles = makeStyles({
  menuListPaper: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    backgroundColor: '#fff',
    boxShadow: '0px 0px 10px 2px #f1f1f1 !important'
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    fontWeight: 'bold',
    color: '#222',
    margin: 0
  },
  menuListCategory: {
    marginRight: 5,
    color: '#222'
  },
  menuListLabel01: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    background: theme.palette.primary.main,
    borderRadius: 2,
    fontSize: 12,
    color: theme.palette.primary.contrastText,
    padding: 2,
    paddingRight: 5,
    paddingLeft: 5
  },
  menuListLabel02: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    background: theme.palette.secondary.main,
    borderRadius: 2,
    fontSize: 12,
    color: theme.palette.secondary.contrastText,
    padding: 2,
    paddingRight: 5,
    paddingLeft: 5
  },
  menuListLabel03: {
    justifyContent: 'center',
    alignItems: 'center',
    background: '#ececec',
    borderRadius: 2,
    fontSize: 12,
    color: '#999',
    padding: 2,
    paddingRight: 5,
    paddingLeft: 5
  },
  menuListName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    margin: 0,
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

export const OrderStyles = makeStyles({
  orderPaper: {
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    textAlign: 'center',
    minHeight: 200,
    border: 1,
    borderColor: theme.palette.primary.main,
    borderStyle: 'dotted',
    WebkitBoxShadow: 'none',
    boxShadow: 'none !important'
  },
  orderTitle: {
    marginBottom: 30,
    textAlign: 'left'
  },
  orderSubtitle: {
    width: 100,
    textAlign: 'left'
  },
  orderBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  orderMenuBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: theme.palette.primary.light,
    border: 1,
    borderColor: theme.palette.primary.light,
    borderStyle: 'solid',
    borderRadius: 5,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,

    '& p': {
      fontSize: 15,
      fontWeight: 'bold'
    }

  }
})