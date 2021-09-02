import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import clsx from 'clsx';

// Material UI Components
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import ButtonGroup from '@material-ui/core/ButtonGroup';
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
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';


// Material icons
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
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import StoreIcon from '@material-ui/icons/Store';

// Local Component
import PrintModal from './PrintModal';
// import OrderPrint from '../components/ComponentToPrint';
import storeAction from '../redux/actions';
import loginAction from '../redux/actions';
import orderAction from '../redux/actions';
import menuControlAction from '../redux/actions';
import { theme, baseStyles, ModalConfirmButton, ModalCancelButton } from '../styles/base';
import Logo from '../assets/images/logo.png';
import CloseStoreModal from './CloseStoreModal'; // 영업중지 모달
import Api from '../Api';
import appRuntime from '../appRuntime';

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
  const { id: mt_store_id, mt_id, mt_jumju_code, mt_store, mt_app_token } = useSelector((state: any) => state.login);
  const { allStore, closedStore } = useSelector((state: any) => state.store);
  const { newOrder, checkOrder, deliveryOrder, doneOrder } = useSelector((state: any) => state.order);
  const { selectType } = useSelector((state: any) => state.menuContr);

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

  // 프린트 모달
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
      await localStorage.removeItem('userAccount');
      await localStorage.removeItem('ohjooStoreToken');
      await dispatch(menuControlAction.updateMenuSelect('order'));
      await history.push('/order_new');
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

  // 프린트 정보
  const openPrint = () => {
    appRuntime.send('openPrint', 'print info?');
    appRuntime.on('printInfo', (event: any, data: any) => {
      console.log("print info data ::", data);
    })
  }

  const menuControlHandler = (payload: string) => {
    dispatch(menuControlAction.updateMenuSelect(payload));
    if (payload === 'order') {
      history.push('order_new');
    } else {
      history.push('set_storetime');
    }
  }

  // 윈도우 닫기 핸들러
  const [winCloseModalOpen, setWinCloseModalOpen] = React.useState(false);
  const windowCloseHandler = () => {
    setWinCloseModalOpen(true);

  }
  const cancelWinCloseHandler = () => {
    setWinCloseModalOpen(false);
  }
  const onCloseWinCloseHandler = () => {
    appRuntime.send('window-close', 'close');
  }

  const sendNotify = () => {
    appRuntime.send('notification', 'test');
  }

  // 메뉴 드로어
  const drawer = (
    <div style={{ backgroundColor: theme.palette.secondary.main, height: '100%' }}>
      <Toolbar style={{ backgroundColor: theme.palette.secondary.main }}>
        {/* <img src={Logo} alt="오늘의주문" style={{ width: 130 }} /> */}
        <ButtonGroup variant="contained" color="primary" style={{ width: '100%' }} aria-label="text primary button group">
          <Button onClick={() => menuControlHandler('order')} style={{ background: selectType === 'order' ? '#ffc739' : '#444259' }}>
            <Typography style={{ color: selectType === 'order' ? '#1c1b30' : '#ffc739' }}>주문</Typography>
          </Button>
          <Button onClick={() => menuControlHandler('store')} style={{ background: selectType === 'store' ? '#ffc739' : '#444259' }}>
            <Typography style={{ color: selectType === 'store' ? '#1c1b30' : '#ffc739' }}>매장</Typography>
          </Button>
        </ButtonGroup>
      </Toolbar>
      {selectType === 'order' ?
        <List className={base.orderMenuWrap} sx={{ padding: 0 }}>
          <ListItem className={base.orderMenu} component={Link} to='/order_new' style={{ color: curPathName === 'order_new' || props.detail === 'order_new' ? theme.palette.secondary.main : theme.palette.secondary.contrastText, backgroundColor: curPathName === 'order_new' || props.detail === 'order_new' ? '#fff' : 'transparent' }}>
            <Typography component='label' variant='body1' style={{ color: (newOrder.length > 0 && curPathName !== 'order_new' && props.detail !== 'order_new') ? '#ffc739' : (newOrder.length > 0 && (curPathName === 'order_new' || props.detail === 'order_new')) ? '#1c1b30' : (newOrder.length == 0 && (curPathName === 'order_new' || props.detail === 'order_new')) ? '#1c1b30' : '#fff' }}>신규주문</Typography>
            <Typography className='count' component='h3' variant='h4' style={{ color: (newOrder.length > 0 && curPathName !== 'order_new' && props.detail !== 'order_new') ? '#ffc739' : (newOrder.length > 0 && (curPathName === 'order_new' || props.detail === 'order_new')) ? '#1c1b30' : (newOrder.length == 0 && (curPathName === 'order_new' || props.detail === 'order_new')) ? '#1c1b30' : '#fff' }}>{newOrder.length > 99 ? '99+' : newOrder.length}</Typography>
          </ListItem>
          <ListItem className={base.orderMenu} component={Link} to='/order_check' style={{ color: curPathName === 'order_check' || props.detail === 'order_check' ? theme.palette.secondary.main : theme.palette.secondary.contrastText, backgroundColor: curPathName === 'order_check' || props.detail === 'order_check' ? '#fff' : 'transparent' }}>
            <Typography component='label' variant='body1' style={{ color: (checkOrder.length > 0 && curPathName !== 'order_check' && props.detail !== 'order_check') ? '#ffc739' : (checkOrder.length > 0 && (curPathName === 'order_check' || props.detail === 'order_check')) ? '#1c1b30' : (checkOrder.length == 0 && (curPathName === 'order_check' || props.detail === 'order_check')) ? '#1c1b30' : '#fff' }}>접수완료</Typography>
            <Typography className='count' component='h3' variant='h4' style={{ color: (checkOrder.length > 0 && curPathName !== 'order_check' && props.detail !== 'order_check') ? '#ffc739' : (checkOrder.length > 0 && (curPathName === 'order_check' || props.detail === 'order_check')) ? '#1c1b30' : (checkOrder.length == 0 && (curPathName === 'order_check' || props.detail === 'order_check')) ? '#1c1b30' : '#fff' }}>{checkOrder.length > 99 ? '99+' : checkOrder.length}</Typography>
          </ListItem>
          <ListItem className={base.orderMenu} component={Link} to='/order_delivery' style={{ color: curPathName === 'order_delivery' || props.detail === 'order_delivery' ? theme.palette.secondary.main : theme.palette.secondary.contrastText, backgroundColor: curPathName === 'order_delivery' || props.detail === 'order_delivery' ? '#fff' : 'transparent' }}>
            <Typography component='label' variant='body1' style={{ color: (deliveryOrder.length > 0 && curPathName !== 'order_delivery' && props.detail !== 'order_delivery') ? '#ffc739' : (deliveryOrder.length > 0 && (curPathName === 'order_delivery' || props.detail === 'order_delivery')) ? '#1c1b30' : (deliveryOrder.length == 0 && (curPathName === 'order_delivery' || props.detail === 'order_delivery')) ? '#1c1b30' : '#fff' }}>배달중</Typography>
            <Typography className='count' component='h3' variant='h4' style={{ color: (deliveryOrder.length > 0 && curPathName !== 'order_delivery' && props.detail !== 'order_delivery') ? '#ffc739' : (deliveryOrder.length > 0 && (curPathName === 'order_delivery' || props.detail === 'order_delivery')) ? '#1c1b30' : (deliveryOrder.length == 0 && (curPathName === 'order_delivery' || props.detail === 'order_delivery')) ? '#1c1b30' : '#fff' }}>{deliveryOrder.length > 99 ? '99+' : deliveryOrder.length}</Typography>
          </ListItem>
          <ListItem className={base.orderMenu} component={Link} to='/order_done' style={{ color: curPathName === 'order_done' || props.detail === 'order_done' ? theme.palette.secondary.main : theme.palette.secondary.contrastText, backgroundColor: curPathName === 'order_done' || props.detail === 'order_done' ? '#fff' : 'transparent' }}>
            <Typography component='label' variant='body1' style={{ color: (doneOrder.length > 0 && curPathName !== 'order_done' && props.detail !== 'order_done') ? '#ffc739' : (doneOrder.length > 0 && (curPathName === 'order_done' || props.detail === 'order_done')) ? '#1c1b30' : (doneOrder.length == 0 && (curPathName === 'order_done' || props.detail === 'order_done')) ? '#1c1b30' : '#fff' }}>배달완료</Typography>
            <Typography className='count' component='h3' variant='h4' style={{ color: (doneOrder.length > 0 && curPathName !== 'order_done' && props.detail !== 'order_done') ? '#ffc739' : (doneOrder.length > 0 && (curPathName === 'order_done' || props.detail === 'order_done')) ? '#1c1b30' : (doneOrder.length == 0 && (curPathName === 'order_done' || props.detail === 'order_done')) ? '#1c1b30' : '#fff' }}>{doneOrder.length > 99 ? '99+' : doneOrder.length}</Typography>
          </ListItem>
        </List>
        :
        selectType === 'store' ?
          <List className={base.orderMenuWrap02} sx={{ padding: 0 }}>
            <ListItem className={base.orderMenu02} component={Link} to='/set_storetime' style={{ color: curPathName === 'set_storetime' ? theme.palette.secondary.main : theme.palette.secondary.contrastText, backgroundColor: curPathName === 'set_storetime' ? '#fff' : 'transparent' }}>
              <Box display='flex' flexDirection='row'>
                <AccessTimeOutlinedIcon />
                <Typography component='label' variant='body1' ml={1}>영업일 및 휴무일</Typography>
              </Box>
            </ListItem>
            <ListItem className={base.orderMenu02} component={Link} to='/caculate' style={{ color: curPathName === 'caculate' ? theme.palette.secondary.main : theme.palette.secondary.contrastText, backgroundColor: curPathName === 'caculate' ? '#fff' : 'transparent' }}>
              <Box display='flex' flexDirection='row'>
                <CalculateOutlinedIcon />
                <Typography component='label' variant='body1' ml={1}>정산내역</Typography>
              </Box>
            </ListItem>
            <ListItem className={base.orderMenu02} component={Link} to='/category' style={{ color: curPathName === 'category' ? theme.palette.secondary.main : theme.palette.secondary.contrastText, backgroundColor: curPathName === 'category' ? '#fff' : 'transparent' }}>
              <Box display='flex' flexDirection='row'>
                <MenuOpenOutlinedIcon />
                <Typography component='label' variant='body1' ml={1}>카테고리</Typography>
              </Box>
            </ListItem>
            <ListItem className={base.orderMenu02} component={Link} to='/menu' style={{ color: curPathName === 'menu' || props.type === 'menuEdit' || props.type === 'menuAdd' ? theme.palette.secondary.main : theme.palette.secondary.contrastText, backgroundColor: curPathName === 'menu' || props.type === 'menuEdit' || props.type === 'menuAdd' ? '#fff' : 'transparent' }}>
              <Box display='flex' flexDirection='row'>
                <RestaurantMenuOutlinedIcon />
                <Typography component='label' variant='body1' ml={1}>메뉴관리</Typography>
              </Box>
            </ListItem>
            <ListItem className={base.orderMenu02} component={Link} to='/coupons' style={{ color: curPathName === 'coupons' ? theme.palette.secondary.main : theme.palette.secondary.contrastText, backgroundColor: curPathName === 'coupons' ? '#fff' : 'transparent' }}>
              <Box display='flex' flexDirection='row'>
                <ConfirmationNumberOutlinedIcon />
                <Typography component='label' variant='body1' ml={1}>쿠폰관리</Typography>
              </Box>
            </ListItem>
            <ListItem className={base.orderMenu02} component={Link} to='/tips' style={{ color: curPathName === 'tips' ? theme.palette.secondary.main : theme.palette.secondary.contrastText, backgroundColor: curPathName === 'tips' ? '#fff' : 'transparent' }}>
              <Box display='flex' flexDirection='row'>
                <InfoOutlinedIcon />
                <Typography component='label' variant='body1' ml={1}>배달팁</Typography>
              </Box>
            </ListItem>
            <ListItem className={base.orderMenu02} component={Link} to='/store_info' style={{ color: curPathName === 'store_info' ? theme.palette.secondary.main : theme.palette.secondary.contrastText, backgroundColor: curPathName === 'store_info' ? '#fff' : 'transparent' }}>
              <Box display='flex' flexDirection='row'>
                <StorefrontOutlinedIcon />
                <Typography component='label' variant='body1' ml={1}>매장소개</Typography>
              </Box>
            </ListItem>
            <ListItem className={base.orderMenu02} component={Link} to='/reviews' style={{ color: curPathName === 'reviews' ? theme.palette.secondary.main : theme.palette.secondary.contrastText, backgroundColor: curPathName === 'reviews' ? '#fff' : 'transparent' }}>
              <Box display='flex' flexDirection='row'>
                <RateReviewOutlinedIcon />
                <Typography component='label' variant='body1' ml={1}>리뷰관리</Typography>
              </Box>
            </ListItem>
          </List>
          : null
      }
    </div >
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
              <Typography color='secondary' style={{ fontWeight: 500, margin: 20 }}>등록된 매장이 없습니다.</Typography>
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
      <PrintModal type='print' isOpen={printOpen} isClose={closePrintModal} />
      <CloseStoreModal isOpen={closeStoreModalOpen} isClose={closeCloseStoreModal} />

      {/* 윈도우 닫기 컨펌 모달 */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={base.modal}
        open={winCloseModalOpen}
        // onClose={props.isClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={winCloseModalOpen}>
          <Box className={clsx(base.modalInner, base.colCenter)}>
            <Typography id="transition-modal-title" component="h5" variant="h5" style={{ fontWeight: 'bold', marginBottom: 10, color: theme.palette.primary.main }}>프로그램 종료</Typography>
            <Typography id="transition-modal-description" mb={2}>프로그램을 종료하시겠습니까?</Typography>
            <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
              <ModalConfirmButton variant="contained" style={{ boxShadow: 'none' }} onClick={onCloseWinCloseHandler}>네, 종료하기</ModalConfirmButton>
              <ModalCancelButton variant="outlined" onClick={cancelWinCloseHandler}>아니요</ModalCancelButton>
            </ButtonGroup>
          </Box>
        </Fade>
      </Modal>
      {/* // 윈도우 닫기 컨펌 모달 */}

      {/* 상단 매장명, 각종 버튼 헤더 */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: 'none',
          flex: 1,
          backgroundColor: theme.palette.secondary.main
        }}
      >
        <Toolbar id='toolbar' style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingRight: 0,
          paddingLeft: 0,
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
                style={{ color: '#fff' }}
                aria-label="open drawer"
                edge="start"
                onClick={() => history.goBack()}
              // sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <ArrowBackIcon />
              </IconButton>
              : null}
            <Box display='flex' flexDirection='row' justifyContent='flex-start' alignItems='baseline'>
              <Box display='flex' flexDirection='row' justifyContent='flex-start' alignItems='center'>
                {allStore && allStore.filter((store: any) => store.mt_id === mt_id).find((state: any) => state.do_end_state === 'N') ?
                  <StopCircleOutlinedIcon style={{ color: '#F8485E', marginRight: 5 }} />
                  :
                  <RadioButtonCheckedIcon style={{ color: '#9FE6A0', marginRight: 5 }} />
                }
                <Typography noWrap fontSize='1.3rem' fontWeight="bold" style={{ color: '#fff' }} mr={0.3}>
                  {mt_store}
                </Typography>
              </Box>
            </Box>
          </Box>
          {/* <Box>
            <Button variant='contained' color='primary' onClick={sendNotify}>NOTIFICATION</Button>
          </Box> */}
          <Box className={base.flexRowStartCenter}>
            {props.detail !== 'order_new' && props.detail !== 'order_check' && props.detail !== 'order_delivery' && props.detail !== 'order_done'
              && props.type !== 'menuAdd' && props.type !== 'menuEdit' && props.type !== 'couponAdd'
              ?
              <Button color="primary" style={{ color: theme.palette.secondary.contrastText, marginRight: 10 }} onClick={openCloseStoreModalHandler}>
                <Badge badgeContent={allStore ? allStore.filter((state: any) => state.do_end_state === 'N').length : 0} color="primary">
                  <StopCircleOutlinedIcon style={{ color: allStore && allStore.filter((state: any) => state.do_end_state === 'N').length > 0 ? '#F8485E' : '#fff' }} />
                </Badge>
                <Typography ml={0.5}>영업일시정지</Typography>
              </Button>
              : null}
            {props.detail === 'order_new' ?
              <Box style={{ marginRight: 20 }}>
                <Button variant='contained' style={{ marginRight: 10 }} onClick={props.action}>
                  <Typography color='secondary'>접수처리</Typography>
                </Button>
                <Button variant='outlined' style={{ borderWidth: 2, marginRight: 20 }} onClick={props.action02}>
                  <Typography color='primary'>거부처리</Typography>
                </Button>
                <IconButton
                  color="primary"
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
                  <Button variant='contained' style={{ marginRight: 10 }} onClick={props.action}>
                    <Typography color='secondary'>배달처리</Typography>
                  </Button>
                  <Button variant='outlined' style={{ borderWidth: 2, marginRight: 20 }} onClick={props.action02}>
                    <Typography color='primary'>취소처리</Typography>
                  </Button>
                  <IconButton
                    color="primary"
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
                : props.detail === 'order_delivery' || props.detail === 'order_done' ?
                  <Box style={{ marginRight: 20 }}>
                    <IconButton
                      color="primary"
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
                    <Button color='primary' variant='contained' style={{ marginRight: 10 }} onClick={() => history.push('/menu_add')}>
                      <Typography variant='body1' fontSize={16} fontWeight='bold'>추가하기</Typography>
                    </Button>
                    : props.type === 'menuAdd' ?
                      <Button color='primary' variant='contained' style={{ marginRight: 10 }} onClick={props.action}>
                        <Typography variant='body1' fontSize={16} fontWeight='bold'>등록하기</Typography>
                      </Button>
                      : props.type === 'menuEdit' ?
                        <Button color='primary' variant='contained' style={{ marginRight: 10 }} onClick={props.action}>
                          <Typography variant='body1' fontSize={16} fontWeight='bold'>수정하기</Typography>
                        </Button>
                        : props.type === 'category' ?
                          <Button color='primary' variant='contained' style={{ marginRight: 10 }} onClick={props.action}>
                            <Typography variant='body1' fontSize={16} fontWeight='bold'>카테고리 추가하기</Typography>
                          </Button>
                          : props.type === 'coupon' ?
                            <Button color='primary' variant='contained' style={{ marginRight: 10 }} onClick={() => history.push('/coupon_add')}>
                              <Typography variant='body1' fontSize={16} fontWeight='bold'>등록하기</Typography>
                            </Button>
                            : props.type === 'couponAdd' ?
                              <Button color='primary' variant='contained' style={{ marginRight: 10 }} onClick={props.action}>
                                <Typography variant='body1' fontSize={16} fontWeight='bold'>저장하기</Typography>
                              </Button>
                              : props.type === 'tips' ?
                                <Button color='primary' variant='contained' style={{ marginRight: 10 }} onClick={props.action}>
                                  <Typography variant='body1' fontSize={16} fontWeight='bold'>등록하기</Typography>
                                </Button>
                                : props.type === 'storeInfo' ?
                                  <Button color='primary' variant='contained' style={{ marginRight: 10 }} onClick={props.action}>
                                    <Typography variant='body1' fontSize={16} fontWeight='bold'>저장하기</Typography>
                                  </Button>
                                  : null}
            {/* <IconButton
              color="info"
              aria-label="list"
              component="span"
              onClick={handleStoreDrawerToggle}
            >
              <AppsIcon />
            </IconButton> */}
            <Button variant='outlined' color='primary' style={{ borderWidth: 2 }} onClick={handleStoreDrawerToggle}>
              <Typography color='primary'>매장선택</Typography>
            </Button>
            <IconButton onClick={windowCloseHandler} style={{ marginLeft: 20 }}>
              <CloseIcon style={{ color: '#fff' }} />
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