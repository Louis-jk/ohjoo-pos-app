import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

// Material UI Components
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
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
import Badge from '@material-ui/core/Badge';

// Material icons
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import PlaylistAddCheckOutlinedIcon from '@material-ui/icons/PlaylistAddCheckOutlined';
import DeliveryDiningOutlinedIcon from '@material-ui/icons/DeliveryDiningOutlined';
import FileDownloadDoneOutlinedIcon from '@material-ui/icons/FileDownloadDoneOutlined';
import AccessTimeOutlinedIcon from '@material-ui/icons/AccessTimeOutlined';
import CalculateOutlinedIcon from '@material-ui/icons/CalculateOutlined';
import MenuOpenOutlinedIcon from '@material-ui/icons/MenuOpenOutlined';
import RestaurantMenuOutlinedIcon from '@material-ui/icons/RestaurantMenuOutlined';
import ConfirmationNumberOutlinedIcon from '@material-ui/icons/ConfirmationNumberOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import StorefrontOutlinedIcon from '@material-ui/icons/StorefrontOutlined';
import RateReviewOutlinedIcon from '@material-ui/icons/RateReviewOutlined';
import LogoutOutlinedIcon from '@material-ui/icons/LogoutOutlined';
import StopCircleOutlinedIcon from '@material-ui/icons/StopCircleOutlined';
import StoreIcon from '@material-ui/icons/Store';

// Local Component
import PrintModal from './PrintModal';
// import OrderPrint from '../components/ComponentToPrint';
import storeAction from '../redux/actions';
import loginAction from '../redux/actions';
import orderAction from '../redux/actions';
import { theme, baseStyles } from '../styles/base';
import { MaterialUISwitch } from './MaterialUISwitch';
import Logo from '../assets/images/logo.png';
import CloseStoreModal from './CloseStoreModal'; // 영업중지 모달
import Api from '../Api';

const drawerWidth = 180;
interface OptionalProps {
  type?: string;
  detail?: string | null;
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
  const { mt_id, mt_jumju_code, mt_store, mt_app_token } = useSelector((state: any) => state.login);
  const { allStore, closedStore } = useSelector((state: any) => state.store);
  const { newOrder, checkOrder, deliveryOrder, doneOrder } = useSelector((state: any) => state.order);

  const [storeListOpen, setStoreListOpen] = React.useState(false); // 매장 선택 드로어  
  const [value, setValue] = React.useState(''); // 매장 선택 값
  const [curPathName, setCurPathName] = React.useState('');

  const [closeStoreModalOpen, setCloseStoreModalOpen] = React.useState(false); // 영업정지 모달 상태

  const openCloseStoreModal = () => {
    setCloseStoreModalOpen(true);
  }
  const closeCloseStoreModal = () => {
    setCloseStoreModalOpen(false);
  }
  const openCloseStoreModalHandler = () => {
    openCloseStoreModal();
  }

  React.useEffect(() => {
    let slice = location.pathname.slice(1);
    setCurPathName(slice);
  }, [location])


  const [printOpen, setPrintOpen] = React.useState(false);
  const openPrintModal = () => {
    setPrintOpen(true);
  }

  const closePrintModal = () => {
    setPrintOpen(false);
  }

  const handlePrint02 = () => {
    openPrintModal();
  }

  // 로그아웃
  const logout = async () => {
    try {
      await dispatch(storeAction.closedStore([]));
      localStorage.removeItem('userAccount');
      localStorage.removeItem('ohjooStoreToken');
      await history.push('/login');
    } catch (err) {
      console.log('로그아웃 중 에러발생', err);
    }

  }

  // 프린트 출력 부분
  const componentRef = React.useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  // 사이드바 드로어 핸들러 
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // 현재 신규주문 건수 가져오기
  const getNewOrderHandler = () => {

    const param = {
      item_count: 0,
      limit_count: 10,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      od_process_status: '신규주문'
    };
    Api.send('store_order_list', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        console.log("신규주문 success?", arrItems);
        dispatch(dispatch(orderAction.updateNewOrder(JSON.stringify(arrItems))));
        getCheckOrderHandler();
      } else {
        console.log("신규주문 faild?", arrItems);
        dispatch(dispatch(orderAction.updateNewOrder(null)));
        getCheckOrderHandler();
      }
    });
  }

  // 현재 접수완료 주문 가져오기
  const getCheckOrderHandler = () => {

    const param = {
      item_count: 0,
      limit_count: 10,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      od_process_status: '접수완료'
    };
    Api.send('store_order_list', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        console.log("접수완료 success?", arrItems);
        dispatch(dispatch(orderAction.updateCheckOrder(JSON.stringify(arrItems))));
        getDeliveryOrderHandler();
      } else {
        console.log("접수완료 faild?", arrItems);
        dispatch(dispatch(orderAction.updateCheckOrder(null)));
        getDeliveryOrderHandler();
      }
    });
  }

  // 현재 배달중 주문 가져오기
  const getDeliveryOrderHandler = () => {

    const param = {
      item_count: 0,
      limit_count: 10,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      od_process_status: '배달중'
    };
    Api.send('store_order_list', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        console.log("배달중 success?", arrItems);
        dispatch(dispatch(orderAction.updateDeliveryOrder(JSON.stringify(arrItems))));
        getDoneOrderHandler();
      } else {
        console.log("배달중 faild?", arrItems);
        dispatch(dispatch(orderAction.updateDeliveryOrder(null)));
        getDoneOrderHandler();
      }
    });
  }

  // 현재 배달완료 주문 가져오기
  const getDoneOrderHandler = () => {

    const param = {
      item_count: 0,
      limit_count: 10,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      od_process_status: '배달완료'
    };
    Api.send('store_order_list', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        console.log("배달완료 success?", arrItems);
        dispatch(dispatch(orderAction.updateDoneOrder(JSON.stringify(arrItems))));
      } else {
        console.log("배달완료 faild?", arrItems);
        dispatch(dispatch(orderAction.updateDoneOrder(null)));
      }
    });
  }

  React.useEffect(() => {
    getNewOrderHandler();
  }, [mt_id, mt_jumju_code])

  // 매장 선택 드로어 핸들러
  const handleStoreDrawerToggle = () => {
    setStoreListOpen(!storeListOpen);
  };

  // 매장 선택 핸들러
  const setStoreHandler = async (store: any, id: string, jumju_id: string, jumju_code: string, storeName: string, addr: string) => {
    try {
      await dispatch(storeAction.selectStore(id, jumju_id, jumju_code, storeName, addr));
      await dispatch(loginAction.updateLogin(JSON.stringify(store)));
      await dispatch(loginAction.updateToken(mt_app_token));
    } catch (err) {
      console.log('에러 발생 ::', err);
    }
  };

  // 메뉴 드로어
  const drawer = (
    <div style={{ backgroundColor: theme.palette.secondary.main, height: '100%' }}>
      <Toolbar style={{ backgroundColor: theme.palette.secondary.main }} sx={{ marginBottom: 3 }}>
        <img src={Logo} alt="오늘의주문" style={{ width: 130 }} />
      </Toolbar>
      <List sx={{ padding: 0 }}>
        <ListItem button component={Link} to='/order_new' style={{ color: curPathName === 'order_new' || props.detail === 'order_new' ? theme.palette.secondary.main : theme.palette.secondary.contrastText, backgroundColor: curPathName === 'order_new' || props.detail === 'order_new' ? theme.palette.primary.dark : 'transparent' }}>
          <ListItemIcon sx={{ minWidth: 35 }} style={{ color: curPathName === 'order_new' || props.detail === 'order_new' ? theme.palette.secondary.main : theme.palette.secondary.contrastText }}>
            <Badge badgeContent={newOrder.length} color="primary" >
              <ListAltOutlinedIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="신규주문" />
        </ListItem>
        <ListItem button component={Link} to='/order_check' style={{ color: curPathName === 'order_check' || props.detail === 'order_check' ? theme.palette.secondary.main : theme.palette.secondary.contrastText, backgroundColor: curPathName === 'order_check' || props.detail === 'order_check' ? theme.palette.primary.dark : 'transparent' }}>
          <ListItemIcon sx={{ minWidth: 35 }} style={{ color: curPathName === 'order_check' || props.detail === 'order_check' ? theme.palette.secondary.main : theme.palette.secondary.contrastText }}>
            <Badge badgeContent={checkOrder.length} color="primary">
              <PlaylistAddCheckOutlinedIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="접수완료" />
        </ListItem>
        <ListItem button component={Link} to='/order_delivery' style={{ color: curPathName === 'order_delivery' || props.detail === 'order_delivery' ? theme.palette.secondary.main : theme.palette.secondary.contrastText, backgroundColor: curPathName === 'order_delivery' || props.detail === 'order_delivery' ? theme.palette.primary.dark : 'transparent' }}>
          <ListItemIcon sx={{ minWidth: 35 }} style={{ color: curPathName === 'order_delivery' || props.detail === 'order_delivery' ? theme.palette.secondary.main : theme.palette.secondary.contrastText }}>
            <Badge badgeContent={deliveryOrder.length} color="primary">
              <DeliveryDiningOutlinedIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="배달중" />
        </ListItem>
        <ListItem button component={Link} to='/order_done' style={{ color: curPathName === 'order_done' || props.detail === 'order_done' ? theme.palette.secondary.main : theme.palette.secondary.contrastText, backgroundColor: curPathName === 'order_done' || props.detail === 'order_done' ? theme.palette.primary.dark : 'transparent' }}>
          <ListItemIcon sx={{ minWidth: 35 }} style={{ color: curPathName === 'order_done' || props.detail === 'order_done' ? theme.palette.secondary.main : theme.palette.secondary.contrastText }}>
            <Badge badgeContent={doneOrder.length} color="primary">
              <FileDownloadDoneOutlinedIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="배달완료" />
        </ListItem>
      </List>
      <Divider />
      <List sx={{ padding: 0 }}>
        <ListItem button component={Link} to='/set_storetime' style={{ color: curPathName === 'set_storetime' ? theme.palette.secondary.main : theme.palette.secondary.contrastText, backgroundColor: curPathName === 'set_storetime' ? theme.palette.primary.dark : 'transparent' }}>
          <ListItemIcon sx={{ minWidth: 35 }} style={{ color: curPathName === 'set_storetime' ? theme.palette.secondary.main : theme.palette.secondary.contrastText }}>
            <AccessTimeOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="영업일 및 휴무일" />
        </ListItem>
        <ListItem button component={Link} to='/caculate' style={{ color: curPathName === 'caculate' ? theme.palette.secondary.main : theme.palette.secondary.contrastText, backgroundColor: curPathName === 'caculate' ? theme.palette.primary.dark : 'transparent' }}>
          <ListItemIcon sx={{ minWidth: 35 }} style={{ color: curPathName === 'caculate' ? theme.palette.secondary.main : theme.palette.secondary.contrastText }}>
            <CalculateOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="정산내역" />
        </ListItem>
        <ListItem button component={Link} to='/category' style={{ color: curPathName === 'category' ? theme.palette.secondary.main : theme.palette.secondary.contrastText, backgroundColor: curPathName === 'category' ? theme.palette.primary.dark : 'transparent' }}>
          <ListItemIcon sx={{ minWidth: 35 }} style={{ color: curPathName === 'category' ? theme.palette.secondary.main : theme.palette.secondary.contrastText }}>
            <MenuOpenOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="카테고리" />
        </ListItem>
        <ListItem button component={Link} to='/menu' style={{ color: curPathName === 'menu' || props.type === 'menuEdit' || props.type === 'menuAdd' ? theme.palette.secondary.main : theme.palette.secondary.contrastText, backgroundColor: curPathName === 'menu' || props.type === 'menuEdit' || props.type === 'menuAdd' ? theme.palette.primary.dark : 'transparent' }}>
          <ListItemIcon sx={{ minWidth: 35 }} style={{ color: curPathName === 'menu' || props.type === 'menuEdit' || props.type === 'menuAdd' ? theme.palette.secondary.main : theme.palette.secondary.contrastText }}>
            <RestaurantMenuOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="메뉴관리" />
        </ListItem>
        <ListItem button component={Link} to='/coupons' style={{ color: curPathName === 'coupons' ? theme.palette.secondary.main : theme.palette.secondary.contrastText, backgroundColor: curPathName === 'coupons' ? theme.palette.primary.dark : 'transparent' }}>
          <ListItemIcon sx={{ minWidth: 35 }} style={{ color: curPathName === 'coupons' ? theme.palette.secondary.main : theme.palette.secondary.contrastText }}>
            <ConfirmationNumberOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="쿠폰관리" />
        </ListItem>
        <ListItem button component={Link} to='/tips' style={{ color: curPathName === 'tips' ? theme.palette.secondary.main : theme.palette.secondary.contrastText, backgroundColor: curPathName === 'tips' ? theme.palette.primary.dark : 'transparent' }}>
          <ListItemIcon sx={{ minWidth: 35 }} style={{ color: curPathName === 'tips' ? theme.palette.secondary.main : theme.palette.secondary.contrastText }}>
            <InfoOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="배달팁" />
        </ListItem>
        <ListItem button component={Link} to='/store_info' style={{ color: curPathName === 'store_info' ? theme.palette.secondary.main : theme.palette.secondary.contrastText, backgroundColor: curPathName === 'store_info' ? theme.palette.primary.dark : 'transparent' }}>
          <ListItemIcon sx={{ minWidth: 35 }} style={{ color: curPathName === 'store_info' ? theme.palette.secondary.main : theme.palette.secondary.contrastText }}>
            <StorefrontOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="매장소개" />
        </ListItem>
        <ListItem button component={Link} to='/reviews' style={{ color: curPathName === 'reviews' ? theme.palette.secondary.main : theme.palette.secondary.contrastText, backgroundColor: curPathName === 'reviews' ? theme.palette.primary.dark : 'transparent' }}>
          <ListItemIcon sx={{ minWidth: 35 }} style={{ color: curPathName === 'reviews' ? theme.palette.secondary.main : theme.palette.secondary.contrastText }}>
            <RateReviewOutlinedIcon />
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
      <Box display="flex" justifyContent="flex-start" alignItems="center" py={0.5} px={1} style={{ backgroundColor: theme.palette.secondary.main, color: '#fff' }}>
        <Typography variant="h5" component="h5" style={{ fontWeight: 500, color: theme.palette.secondary.contrastText, margin: '12px 20px' }}>매장선택</Typography>
      </Box>
      <Divider />
      <Box display="flex" flex={3}>
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
      <Box justifySelf="flex-end" p={1} style={{ backgroundColor: '#ececec' }}>
        <Button style={{ color: theme.palette.primary.contrastText }} onClick={logout}>
          <LogoutOutlinedIcon />
          <Typography ml={1}>로그아웃</Typography>
        </Button>
      </Box>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box>
      <PrintModal isOpen={printOpen} isClose={closePrintModal} />
      <CloseStoreModal isOpen={closeStoreModalOpen} isClose={closeCloseStoreModal} />

      {/* 상단 매장명, 각종 버튼 헤더 */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: 'none',
          flex: 1,
          backgroundColor: '#fff'
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
              || props.detail === 'order_new' || props.detail === 'order_check' || props.detail === 'order_delivery' || props.detail === 'order_done'
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
            <Typography noWrap fontSize='1.3rem' fontWeight="bold">
              {mt_store}
            </Typography>
          </Box>
          <Box className={base.flexRowStartCenter}>
            {props.detail !== 'order_new' && props.detail !== 'order_check' && props.detail !== 'order_delivery' && props.detail !== 'order_done'
              && props.type !== 'menuAdd' && props.type !== 'menuEdit' && props.type !== 'couponAdd'
              ?
              <Button color="primary" style={{ color: theme.palette.primary.contrastText, marginRight: 10 }} onClick={openCloseStoreModalHandler}>
                <Badge badgeContent={closedStore ? closedStore.length : 0} color="secondary">
                  <StopCircleOutlinedIcon style={{ color: closedStore ? '#F8485E' : '#222' }} />
                </Badge>
                <Typography ml={1}>영업일시정지</Typography>
              </Button>
              : null}
            {props.detail === 'order_new' ?
              <Box>
                <Button style={{ padding: '10px 20px', marginRight: 10, backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText }} onClick={props.action}>
                  접수처리
                </Button>
                <Button style={{ padding: '10px 20px', marginRight: 10, backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText }} onClick={props.action02}>
                  거부처리
                </Button>
                <IconButton
                  color="info"
                  aria-label="list"
                  component="span"
                  onClick={handlePrint02}
                >
                  <PrintIcon />
                </IconButton>
                {/* <Box style={{ display: 'none' }}>
                  <OrderPrint ref={componentRef} />
                </Box> */}
              </Box>
              : props.detail === 'order_check' ?
                <Box>
                  <Button style={{ padding: '10px 20px', marginRight: 10, backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText }} startIcon={<DoneIcon />} onClick={props.action}>
                    배달처리
                  </Button>
                  <Button style={{ padding: '10px 20px', marginRight: 10, backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText }} startIcon={<CloseIcon />} onClick={props.action02}>
                    취소처리
                  </Button>
                  <IconButton
                    color="info"
                    aria-label="list"
                    component="span"
                    onClick={handlePrint02}
                  >
                    <PrintIcon />
                  </IconButton>
                  {/* <Box style={{ display: 'none' }}>
                    <OrderPrint ref={componentRef} />
                  </Box> */}
                </Box>
                : props.detail === 'order_delivery' ?
                  <Box>
                    <IconButton
                      color="info"
                      aria-label="list"
                      component="span"
                      onClick={handlePrint02}
                    >
                      <PrintIcon />
                    </IconButton>
                    {/* <Box style={{ display: 'none' }}>
                      <OrderPrint ref={componentRef} />
                    </Box> */}
                  </Box>
                  : props.detail === 'order_done' ?
                    <Box>
                      <IconButton
                        color="info"
                        aria-label="list"
                        component="span"
                        onClick={handlePrint02}
                      >
                        <PrintIcon />
                      </IconButton>
                      {/* <Box style={{ display: 'none' }}>
                        <OrderPrint ref={componentRef} />
                      </Box> */}
                    </Box>
                    : props.type === 'menu' ?
                      <Button style={{ padding: '10px 20px', marginRight: 10, backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText }} onClick={() => history.push('/menu_add')}>
                        메뉴 추가하기
                      </Button>
                      : props.type === 'menuAdd' ?
                        <Button style={{ padding: '10px 20px', marginRight: 10, backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText }} onClick={props.action}>
                          등록하기
                        </Button>
                        : props.type === 'menuEdit' ?
                          <Button style={{ padding: '10px 20px', marginRight: 10, backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText }} onClick={props.action}>
                            수정하기
                          </Button>
                          : props.type === 'category' ?
                            <Button style={{ padding: '10px 20px', marginRight: 10, backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText }} onClick={props.action}>
                              카테고리 추가하기
                            </Button>
                            : props.type === 'coupon' ?
                              <Button style={{ padding: '10px 20px', marginRight: 10, backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText }} onClick={() => history.push('/coupon_add')}>
                                등록하기
                              </Button>
                              : props.type === 'couponAdd' ?
                                <Button style={{ padding: '10px 20px', marginRight: 10, backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText }} onClick={props.action}>
                                  저장하기
                                </Button>
                                : props.type === 'tips' ?
                                  <Button style={{ padding: '10px 20px', marginRight: 10, backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText }} onClick={props.action}>
                                    등록하기
                                  </Button>
                                  : props.type === 'storeInfo' ?
                                    <Button style={{ padding: '10px 20px', marginRight: 10, backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText }} onClick={props.action}>
                                      저장하기
                                    </Button>
                                    : null}
            <IconButton
              color="info"
              aria-label="list"
              component="span"
              onClick={handleStoreDrawerToggle}
            >
              <AppsIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 왼쪽 사이드바 */}
      <Box
        component="nav"
        sx={{ flex: 1, width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
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
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
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
    </Box>
  );
}
