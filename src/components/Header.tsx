import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import AppsIcon from '@material-ui/icons/Apps';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PrintIcon from '@material-ui/icons/Print';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import FormGroup from '@material-ui/core/FormGroup';
import Switch, { SwitchProps } from '@material-ui/core/Switch';
import { ButtonGroup } from '@material-ui/core';

import storeAction from '../redux/actions';
import loginAction from '../redux/actions';
import { theme, baseStyles } from '../styles/base';
import { MaterialUISwitch } from './MaterialUISwitch';

import OrderPrint from '../components/ComponentToPrint';

const drawerWidth = 200;
interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

interface OptionalProps {
  type?: string;
  detail?: string;
  action?: () => void;
  action02?: () => void;
  window?: () => Window;
}

export default function ResponsiveDrawer(props: OptionalProps) {
  // console.log("Header props data >>>", props);
  const { window } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const base = baseStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false); // 메뉴 드로어
  const { mt_store } = useSelector((state: any) => state.login);
  const { allStore, selectedStore } = useSelector((state: any) => state.store);

  const [storeListOpen, setStoreListOpen] = React.useState(false); // 매장 선택 드로어  
  const [value, setValue] = React.useState(''); // 매장 선택 값
  const [curPathName, setCurPathName] = React.useState('');

  React.useEffect(() => {
    let slice = location.pathname.slice(1);
    setCurPathName(slice);
  }, [location])

  // 프린트 출력 부분
  const componentRef = React.useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleStoreDrawerToggle = () => {
    setStoreListOpen(!storeListOpen);
  };

  const setStoreHandler = (store: any, id: string, jumju_id: string, jumju_code: string, storeName: string, addr: string) => {
    dispatch(storeAction.selectStore(id, jumju_id, jumju_code, storeName, addr));
    dispatch(loginAction.updateLogin(JSON.stringify(store)));
    // dispatch(loginAction.updateToken(JSON.stringify(mt_app_token)));

    // let param = {
    //   mt_id: jumju_id,
    //   mt_app_token: mt_app_token
    // };

    // Api.send('store_login_token', param, (args)=>{
    //   let resultItem = args.resultItem;
    //   let arrItems = args.arrItems;
    //   console.log('토큰 업데이트 실행시 resultItem::: ', resultItem);
    //   console.log('토큰 업데이트 실행시  arrItems::: ', arrItems);
    //   if (resultItem.result === 'Y') {
    //     console.log('토큰 업데이트 실행 결과값 ::: ', arrItems);
    //   } else {
    //     console.log('토큰 업데이트 실패');
    //   }
    // });
  };

  // 메뉴 드로어
  const drawer = (
    <div style={{ backgroundColor: theme.palette.secondary.main }}>
      <Toolbar />
      <Divider />
      <List>
        <ListItem button component={Link} to='/order_new' style={{ color: curPathName === 'order_new' || props.detail === 'order_new' ? theme.palette.primary.contrastText : theme.palette.secondary.contrastText, backgroundColor: curPathName === 'order_new' || props.detail === 'order_new' ? theme.palette.primary.main : 'transparent' }}>
          <ListItemIcon style={{ color: theme.palette.secondary.contrastText }}>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="신규주문" />
        </ListItem>
        <ListItem button component={Link} to='/order_check' style={{ color: curPathName === 'order_check' || props.detail === 'order_check' ? theme.palette.primary.contrastText : theme.palette.secondary.contrastText, backgroundColor: curPathName === 'order_check' || props.detail === 'order_check' ? theme.palette.primary.main : 'transparent' }}>
          <ListItemIcon style={{ color: theme.palette.secondary.contrastText }}>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="접수완료" />
        </ListItem>
        <ListItem button component={Link} to='/order_delivery' style={{ color: curPathName === 'order_delivery' || props.detail === 'order_delivery' ? theme.palette.primary.contrastText : theme.palette.secondary.contrastText, backgroundColor: curPathName === 'order_delivery' || props.detail === 'order_delivery' ? theme.palette.primary.main : 'transparent' }}>
          <ListItemIcon style={{ color: theme.palette.secondary.contrastText }}>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="배달중" />
        </ListItem>
        <ListItem button component={Link} to='/order_done' style={{ color: curPathName === 'order_done' || props.detail === 'order_done' ? theme.palette.primary.contrastText : theme.palette.secondary.contrastText, backgroundColor: curPathName === 'order_done' || props.detail === 'order_done' ? theme.palette.primary.main : 'transparent' }}>
          <ListItemIcon style={{ color: theme.palette.secondary.contrastText }}>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="배달완료" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button component={Link} to='/set_storetime' style={{ color: theme.palette.secondary.contrastText }}>
          <ListItemIcon style={{ color: theme.palette.secondary.contrastText }}>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="영업일 및 휴무일" />
        </ListItem>
        <ListItem button component={Link} to='/caculate' style={{ color: theme.palette.secondary.contrastText }}>
          <ListItemIcon style={{ color: theme.palette.secondary.contrastText }}>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="정산내역" />
        </ListItem>
        <ListItem button component={Link} to='/category' style={{ color: theme.palette.secondary.contrastText }}>
          <ListItemIcon style={{ color: theme.palette.secondary.contrastText }}>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="카테고리" />
        </ListItem>
        <ListItem button component={Link} to='/menu' style={{ color: theme.palette.secondary.contrastText }}>
          <ListItemIcon style={{ color: theme.palette.secondary.contrastText }}>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="메뉴관리" />
        </ListItem>
        <ListItem button component={Link} to='/coupons' style={{ color: theme.palette.secondary.contrastText }}>
          <ListItemIcon style={{ color: theme.palette.secondary.contrastText }}>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="쿠폰관리" />
        </ListItem>
        <ListItem button component={Link} to='/tips' style={{ color: theme.palette.secondary.contrastText }}>
          <ListItemIcon style={{ color: theme.palette.secondary.contrastText }}>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="배달팁" />
        </ListItem>
        <ListItem button component={Link} to='/store_info' style={{ color: theme.palette.secondary.contrastText }}>
          <ListItemIcon style={{ color: theme.palette.secondary.contrastText }}>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="매장소개" />
        </ListItem>
        <ListItem button component={Link} to='/reviews' style={{ color: theme.palette.secondary.contrastText }}>
          <ListItemIcon style={{ color: theme.palette.secondary.contrastText }}>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="리뷰관리" />
        </ListItem>
      </List>
    </div>
  );

  // 매장 선택 드로어
  const storeListDrawer = (
    <Box style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
      {/* <div className={classes.toolbar} /> */}
      <Box /* className={classes.toolbar}  */ style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: theme.palette.secondary.main, color: '#fff', padding: '5px 10px' }}>
        <Typography variant="h5" component="h5" style={{ fontWeight: 500, color: theme.palette.secondary.contrastText, margin: '12px 20px' }}>매장선택</Typography>
      </Box>
      <Divider />
      <FormControl component="fieldset" style={{ padding: 10 }}>
        <RadioGroup aria-label="select_store" name="store" value={value} onChange={handleChange}>
          {allStore && allStore.length > 0 ? allStore.map((store: any, index: number) => (
            <Box key={index}>
              <FormControlLabel
                value={store.mt_store}
                control={<Radio color="primary" />}
                label={store.mt_store}
                style={{ margin: 10, color: '#222' }}
                onClick={() => setStoreHandler(store, store.id, store.mt_id, store.mt_jumju_code, store.mt_store, store.mt_addr)}
                checked={store.mt_store === mt_store ? true : false}
              />
              <Divider />
            </Box>
          )) :
            <Typography style={{ fontWeight: 500, margin: 20 }}>등록된 매장이 없습니다.</Typography>
          }
        </RadioGroup>
      </FormControl>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box className={base.flexRowStartCenter}>
            {props.type === 'menuAdd' || props.type === 'menuEdit' || props.type === 'couponAdd'
              || props.detail === 'order' || props.detail === 'order_new' || props.detail === 'order_check'
              ?
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={() => history.goBack()}
              // sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <ArrowBackIcon />
              </IconButton>
              : null}
            <Typography variant="h6" noWrap component="div">
              {mt_store}
            </Typography>
          </Box>
          <Box className={base.flexRowStartCenter}>
            <FormGroup>
              <FormControlLabel
                style={{ marginRight: 30 }}
                control={<MaterialUISwitch sx={{ m: 1, mr: 0 }} defaultChecked />}
                label="영업정지"
              />
            </FormGroup>
            {props.detail === 'order_new' ?
              <Box>
                <Button style={{ padding: '10px 20px', marginRight: 10, backgroundColor: theme.palette.secondary.main }} onClick={props.action}>
                  접수처리
                </Button>
                <Button style={{ padding: '10px 20px', marginRight: 10, backgroundColor: theme.palette.secondary.main }} onClick={props.action02}>
                  거부처리
                </Button>
                <IconButton
                  color="secondary"
                  aria-label="list"
                  component="span"
                  onClick={handlePrint}
                >
                  <PrintIcon />
                </IconButton>
                <Box style={{ display: 'none' }}>
                  <OrderPrint ref={componentRef} />
                </Box>
              </Box>
              : props.detail === 'order_check' ?
                <Box>
                  <Button style={{ padding: '10px 20px', marginRight: 10, backgroundColor: theme.palette.secondary.main }} startIcon={<DoneIcon />} onClick={props.action}>
                    배달처리
                  </Button>
                  <Button style={{ padding: '10px 20px', marginRight: 10, backgroundColor: theme.palette.secondary.main }} startIcon={<CloseIcon />} onClick={props.action02}>
                    취소처리
                  </Button>
                  <IconButton
                    color="secondary"
                    aria-label="list"
                    component="span"
                    onClick={handlePrint}
                  >
                    <PrintIcon />
                  </IconButton>
                  <Box style={{ display: 'none' }}>
                    <OrderPrint ref={componentRef} />
                  </Box>
                </Box>
                : props.detail === 'order' ?
                  <Box>
                    <IconButton
                      color="secondary"
                      aria-label="list"
                      component="span"
                      onClick={handlePrint}
                    >
                      <PrintIcon />
                    </IconButton>
                    <Box style={{ display: 'none' }}>
                      <OrderPrint ref={componentRef} />
                    </Box>
                  </Box>
                  : props.type === 'menu' ?
                    <Button style={{ padding: '10px 20px', marginRight: 10, backgroundColor: theme.palette.secondary.main }} onClick={() => history.push('/menu_add')}>
                      메뉴 추가하기
                    </Button>
                    : props.type === 'menuAdd' ?
                      <Button style={{ padding: '10px 20px', marginRight: 10, backgroundColor: theme.palette.secondary.main }} onClick={() => history.push('/menu_add')}>
                        등록하기
                      </Button>
                      : props.type === 'menuEdit' ?
                        <Button style={{ padding: '10px 20px', marginRight: 10, backgroundColor: theme.palette.secondary.main }} onClick={() => history.push('/menu_add')}>
                          수정하기
                        </Button>
                        : props.type === 'category' ?
                          <Button style={{ padding: '10px 20px', marginRight: 10, backgroundColor: theme.palette.secondary.main }} onClick={() => history.push('/menu_add')}>
                            카테고리 추가하기
                          </Button>
                          : props.type === 'coupon' ?
                            <Button style={{ padding: '10px 20px', marginRight: 10, backgroundColor: theme.palette.secondary.main }} onClick={() => history.push('/coupon_add')}>
                              등록하기
                            </Button>
                            : props.type === 'couponAdd' ?
                              <Button style={{ padding: '10px 20px', marginRight: 10, backgroundColor: theme.palette.secondary.main }} onClick={props.action}>
                                저장하기
                              </Button>
                              : props.type === 'tips' ?
                                <Button style={{ padding: '10px 20px', marginRight: 10, backgroundColor: theme.palette.secondary.main }} onClick={props.action}>
                                  등록하기
                                </Button>
                                : props.type === 'storeInfo' ?
                                  <Button style={{ padding: '10px 20px', marginRight: 10, backgroundColor: theme.palette.secondary.main }} onClick={props.action}>
                                    저장하기
                                  </Button>
                                  : null}
            <IconButton
              color="secondary"
              aria-label="list"
              component="span"
              onClick={handleStoreDrawerToggle}
            >
              <AppsIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
        <Drawer
          container={container}
          variant="temporary"
          anchor='right'
          open={storeListOpen}
          onClose={handleStoreDrawerToggle}
          // classes={{
          //   paper: classes.storeListDrawerPaper,
          // }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {storeListDrawer}
        </Drawer>
      </Box>
    </>
  );
}
