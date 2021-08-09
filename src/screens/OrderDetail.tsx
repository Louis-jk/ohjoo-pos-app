import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import moment from 'moment';
import 'moment/locale/ko';
import { withRouter, RouteComponentProps, useParams, useHistory } from 'react-router-dom'

// Material UI Components
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Paper, { PaperProps } from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

// Local Component
import Api from '../Api';
import Header from '../components/Header';
import orderDetailAction from '../redux/actions';
import { theme, MainBox, baseStyles, ModalConfirmButton, ModalCancelButton } from '../styles/base';
import { OrderStyles } from '../styles/custom';
import OrderCheckModal from '../components/OrderCheckModal'; // 신규주문 주문 접수 모달
import OrderRejectModal from '../components/OrderRejectModal'; // 신규주문 주문 거부 모달


interface OrderId {
  id: string;
}

interface IDetails {
  [key: string]: string;
}


export default function OrdersDetail(od_id: string) {

  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);
  const history = useHistory();
  const dispatch = useDispatch();
  const base = baseStyles();
  const order = OrderStyles();
  const { id }: OrderId = useParams();
  const [open, setOpen] = React.useState(false); // 신규 주문 -> 접수(배달/포장 시간 입력 모달)
  const [openDelivery, setOpenDelivery] = React.useState(false); // 접수 완료 -> 배달 처리 모달
  const [openReject, setOpenReject] = React.useState(false); // 신규 주문 -> 주문 거부
  const [openCancel, setOpenCancel] = React.useState(false); // 접수 완료 -> 주문 취소

  const [detailStore, setDetailStore] = React.useState<IDetails>({});
  const [detailOrder, setDetailOrder] = React.useState<IDetails>({});
  const [detailProduct, setDetailProduct] = React.useState<IDetails[]>([]);
  const [deliveryTime, setDeliveryTime] = React.useState(''); // 신규 주문 -> 배달시간 입력
  const [rejectValue, setRejectValue] = React.useState(''); // 신규 주문 -> 주문 거부 사유 선택
  const [rejectEtc, setRejectEtc] = React.useState(''); // 신규 주문 -> 주문 거부 사유 '기타' 직접 입력 값
  const [cancelValue, setCancelValue] = React.useState(''); // 접수 완료 -> 주문 취소 사유 선택
  const [cancelEtc, setCancelEtc] = React.useState(''); // 접수 완료 -> 주문 취소 사유 '기타' 직접 입력 값
  const rejectRef = React.useRef<HTMLDivElement | null>(null); // 신규 주문 -> 주문 거부 textField Reference
  const cancelRef = React.useRef<HTMLDivElement | null>(null); // 접수 완료 -> 주문 취소 textField Reference

  const [odId, setOdId] = React.useState('');
  const [odType, setOdType] = React.useState('');

  // 주문 거부 선택 값
  const rejectInitState = [
    {
      label: '배달 불가 지역',
      value: '1'
    },
    {
      label: '메뉴 및 업소 정보 다름',
      value: '2'
    },
    {
      label: '재료 소진',
      value: '3'
    },
    {
      label: '배달 지연',
      value: '4'
    },
    {
      label: '고객 정보 부정확',
      value: '5'
    },
    {
      label: '기타',
      value: '6'
    },
  ]

  // 주문 취소 선택 값
  const cancelInitState = [
    {
      label: '고객 요청',
      value: '1'
    },
    {
      label: '업소 사정',
      value: '2'
    },
    {
      label: '배달 불가',
      value: '3'
    },
    {
      label: '재료 소진',
      value: '4'
    },
    {
      label: '기타',
      value: '5'
    }
  ]

  // Toast(Alert) 관리
  const [toastState, setToastState] = React.useState({
    msg: '',
    severity: ''
  });
  const [openAlert, setOpenAlert] = React.useState(false);
  const handleOpenAlert = () => {
    setOpenAlert(true);
  };
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  // 주문 디테일 정보 가져오기
  const getOrderDetailHandler = () => {
    const param = {
      item_count: 0,
      limit_count: 10,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      od_id: id
    };
    Api.send('store_order_detail', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        dispatch(orderDetailAction.updateOrderDetail(JSON.stringify(arrItems)));
        setDetailStore(arrItems.store);
        setDetailOrder(arrItems.order);
        setDetailProduct(arrItems.product);
      } else {
        console.log("faild?", arrItems)
        alert('주문 정보를 받아올 수 없습니다.')
        setDetailStore({});
        setDetailOrder({});
        setDetailProduct([]);
      }
    });
  }

  React.useEffect(() => {
    getOrderDetailHandler();
  }, [])

  // 신규주문 상태 -> 접수(배달/포장 시간 입력) 모달 핸들러
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDeliveryTime('');
  };

  const newFn = () => {
    handleOpen();
  }
  const checkOrderHandler = (id: string, type: string) => {
    setOdId(id);
    setOdType(type);
    handleOpen();
  }

  // 신규주문 상태 -> 주문 거부 모달 핸들러
  const handleOpenReject = () => {
    setOpenReject(true);
  };

  const handleCloseReject = () => {
    setOpenReject(false);
    setRejectValue('');
    setRejectEtc('');
  };

  const newRejectHandler = () => {
    handleOpenReject();
  }


  // 접수완료 상태 -> 주문 취소 모달 핸들러
  const handleOpenCancel = () => {
    setOpenCancel(true);
  };

  const handleCloseCancel = () => {
    setOpenCancel(false);
    setCancelValue('');
    setCancelEtc('');
  };

  const checkCancelHandler = () => {
    handleOpenCancel();
  }


  // 접수완료 상태 -> 주문 취소 핸들러
  const cancelHandler = (payload: string) => {
    if (payload === '5') {
      console.log("payload is ::", payload);
      cancelRef.current?.focus();
    }
    setCancelValue(payload);
  }

  // 접수완료 상태 -> 배달처리 핸들러
  const handleOpenDelivery = () => {
    setOpenDelivery(true);
  };

  const handleCloseDelivery = () => {
    setOpenDelivery(false);
  };

  const checkFn = () => {
    handleOpenDelivery();
  }

  // 신규주문 -> 주문 거부 모달 핸들러
  const [rejectOopen, setRejectOpen] = React.useState(false);
  const handleRejectOpen = () => {
    setRejectOpen(true);
  };

  const handleRejectClose = () => {
    setRejectOpen(false);
  };


  // 배달처리 (접수완료 -> 배달 중 상태)
  const sendDeliveryHandler = () => {

    let param = {
      od_id: id,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      od_process_status: '배달중',
    };

    Api.send('store_order_status_update', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;
      if (resultItem.result === 'Y') {
        setToastState({ msg: '주문을 배달 처리하였습니다.', severity: 'success' });
        handleOpenAlert();
        handleCloseDelivery();
        history.push('/order_delivery');
      } else {
        setToastState({ msg: '주문을 배달 처리하는데 문제가 생겼습니다.', severity: 'error' });
        handleOpenAlert();
        handleCloseDelivery();
      }
    });
  };

  // 접수완료 주문 취소 
  const sendCancelHandler = () => {
    if (cancelValue === '') {
      setToastState({ msg: '취소 사유를 선택 또는 입력해주세요.', severity: 'error' });
      handleOpenAlert();
    } else if (cancelValue === '5' && cancelEtc === '') {
      setToastState({ msg: '기타 입력 항목에 이유를 입력해주세요.', severity: 'error' });
      handleOpenAlert();
    } else {
      let result;
      if (cancelValue !== '5') {
        let filtered = cancelInitState.filter(item => item.value === cancelValue);
        result = filtered[0].label;
      } else {
        result = cancelEtc;
      }

      let param = {
        od_id: id,
        jumju_id: mt_id,
        jumju_code: mt_jumju_code,
        mode: 'cancle',
        od_cancle_memo: result
      };

      Api.send('store_order_cancle', param, (args: any) => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;
        if (resultItem.result === 'Y') {
          setToastState({ msg: '주문을 정상적으로 취소 처리 하였습니다.', severity: 'success' });
          handleOpenAlert();
          handleCloseCancel();
          setTimeout(() => {
            history.push('/');
          }, 700);
        } else {
          setToastState({ msg: '주문을 취소 처리하는데 문제가 생겼습니다.', severity: 'error' });
          handleOpenAlert();
          handleCloseCancel();
        }
      });
    }
  }

  console.log("detailOrder", detailOrder);

  return (
    <Box component="div" className={base.root}>
      {detailOrder ?
        <Header
          detail={
            detailOrder.od_process_status === '신규주문' ? 'order_new'
              : detailOrder.od_process_status === '접수완료' ? 'order_check'
                : 'order'}
          action={
            detailOrder.od_process_status === '신규주문' ? () => newFn()
              : detailOrder.od_process_status === '접수완료' ? () => checkFn()
                : () => { return false }
          }
          action02={
            detailOrder.od_process_status === '신규주문' ? () => handleRejectOpen()
              : detailOrder.od_process_status === '접수완료' ? () => checkCancelHandler()
                : () => { return false }
          }
        />
        : null}
      {/* <Header detail='order' /> */}

      {detailOrder ?
        <>
          <OrderCheckModal isOpen={open} od_id={id} od_type={detailOrder.od_type} handleClose={handleClose} />
          <OrderRejectModal isOpen={rejectOopen} od_id={id} handleClose={handleRejectClose} />
        </>
        : null}
      <Box className={base.alertStyle}>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          open={openAlert}
          autoHideDuration={5000}
          onClose={handleCloseAlert}
        >
          <Alert onClose={handleCloseAlert} severity={toastState.severity === 'error' ? 'error' : 'success'}>
            {toastState.msg}
          </Alert>
        </Snackbar>
      </Box>


      {/* 접수하기 모달(예상 배달시간 입력 폼) */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={base.modal}
        open={openDelivery}
        // onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openDelivery}>
          <Box className={clsx(base.modalInner, base.colCenter)}>
            <Typography id="transition-modal-title" component="h5" variant="h5" style={{ fontWeight: 'bold', marginBottom: 10, color: theme.palette.primary.main }}>배달처리</Typography>
            <Typography id="transition-modal-description" style={{ marginBottom: 20 }}>배달처리를 하시겠습니까?</Typography>
            <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
              <ModalConfirmButton variant="contained" color="primary" className={base.confirmBtn} style={{ marginLeft: 0, minWidth: 150 }} onClick={sendDeliveryHandler}>배달처리</ModalConfirmButton>
              <ModalConfirmButton variant="outlined" className={base.confirmBtn} style={{ minWidth: 150 }} onClick={handleCloseDelivery}>취소</ModalConfirmButton>
            </ButtonGroup>
          </Box>
        </Fade>
      </Modal>
      {/* // 접수하기 모달(예상 배달시간 입력 폼) */}

      {/* 주문 취소 모달 */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={base.modal}
        open={openCancel}
        // onClose={handleCloseCancel}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openCancel}>
          <Box className={clsx(base.modalInner, base.colCenter)}>
            <Typography id="transition-modal-title" component="h5" variant="h5" style={{ fontWeight: 'bold', marginBottom: 10, color: '#53447A' }}>주문 취소 사유 등록</Typography>
            <Typography id="transition-modal-description">주문 취소 사유를 선택 또는 입력해주세요.</Typography>
            <Grid container spacing={1} style={{ margin: 20 }}>
              {cancelInitState.map((item, index) => (
                <Grid item xs={6} md={4} key={index}>
                  <Button variant="outlined" style={{ width: '100%', padding: 10, backgroundColor: cancelValue === item.value ? '#FCDD00' : '#fff', color: '#222', borderColor: cancelValue === item.value ? '#FCDD00' : '#e6e6e6' }} onClick={() => cancelHandler(item.value)}>{item.label}</Button>
                </Grid>
              ))}
            </Grid>
            <TextField
              inputRef={cancelRef}
              value={cancelEtc}
              style={{ margin: 20 }}
              fullWidth
              id="outlined-basic"
              label="주문 취소 사유"
              variant="outlined"
              required
              onFocus={() => cancelHandler('5')}
              onChange={e => setCancelEtc(e.target.value as string)}
            />
            <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
              <ModalConfirmButton fullWidth variant="contained" onClick={sendCancelHandler}>보내기</ModalConfirmButton>
              <ModalCancelButton fullWidth variant="outlined" onClick={handleCloseCancel}>취소</ModalCancelButton>
            </ButtonGroup>
          </Box>
        </Fade>
      </Modal>
      {/* // 주문 취소 모달 */}

      <MainBox component='main' sx={{ flexGrow: 1, p: 3 }}>
        {detailStore && detailOrder && detailProduct ?
          <Grid container justifyContent="space-between" alignItems="flex-end" style={{ marginBottom: 30 }}>
            <Grid item xs={12} md={6}>
              <Paper className={order.orderPaper}>
                <Typography variant="h6" component="h6" className={order.orderTitle}>주문매장</Typography>
                <Box fontSize={14} className={order.orderBox}>
                  <Typography variant="body1" className={order.orderSubtitle}>상호명</Typography>
                  <Typography variant="body1">{detailStore.mb_company}</Typography>
                </Box>
                <Box fontSize={14} className={order.orderBox}>
                  <Typography variant="body1" className={order.orderSubtitle}>주문시간</Typography>
                  <Typography variant="body1">{moment(detailStore.od_time).format('YYYY년 M월 D일 HH시 mm분')}</Typography>
                </Box>
                <Box fontSize={14} className={order.orderBox}>
                  <Typography variant="body1" className={order.orderSubtitle}>주문방법</Typography>
                  <Typography variant="body1">{detailOrder.od_type}</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={order.orderPaper}>
                <Typography variant="h6" component="h6" className={order.orderTitle}>메뉴정보</Typography>
                <Box fontSize={14} className={order.orderBox}>
                  {detailProduct.map((menu, index) => (
                    <Box className={order.orderMenuBox} key={index}>
                      <Typography variant="body1" style={{ marginRight: 10 }}>메뉴 : {menu.it_name}</Typography>
                      <Typography variant="body1" style={{ marginRight: 10 }}>/</Typography>
                      <Typography variant="body1">옵션 - {menu.ct_option}</Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={order.orderPaper}>
                <Typography variant="h6" component="h6" className={order.orderTitle}>요청사항</Typography>
                <Box fontSize={14} className={order.orderBox}>
                  <Typography variant="body1" className={order.orderSubtitle}>사장님께</Typography>
                  <Typography variant="body1">{detailOrder.order_seller !== '' ? detailOrder.order_seller : '요청사항이 없습니다.'}</Typography>
                </Box>
                <Box fontSize={14} className={order.orderBox}>
                  <Typography variant="body1" className={order.orderSubtitle}>배달기사님께</Typography>
                  <Typography variant="body1">{detailOrder.order_officer !== '' ? detailOrder.order_officer : '요청사항이 없습니다.'}</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={order.orderPaper}>
                <Typography variant="h6" component="h6" className={order.orderTitle}>배달정보</Typography>
                <Box fontSize={14} className={order.orderBox}>
                  <Typography variant="body1" className={order.orderSubtitle}>배달주소</Typography>
                  <Box style={{ textAlign: 'left' }}>
                    <Typography variant="body1">{detailOrder.order_addr1}</Typography>
                    <Typography variant="body1">{detailOrder.order_addr3}</Typography>
                  </Box>
                </Box>
                <Box fontSize={14} className={order.orderBox}>
                  <Typography variant="body1" className={order.orderSubtitle}>전화번호</Typography>
                  <Typography variant="body1">{detailOrder.order_hp}</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={order.orderPaper}>
                <Typography variant="h6" component="h6" className={order.orderTitle}>결제정보</Typography>
                <Box fontSize={14} className={order.orderBox}>
                  <Typography variant="body1" className={order.orderSubtitle}>총 주문금액</Typography>
                  <Typography variant="body1">{Api.comma(detailOrder.odder_cart_price)} 원</Typography>
                </Box>
                <Box fontSize={14} className={order.orderBox}>
                  <Typography variant="body1" className={order.orderSubtitle}>배달팁</Typography>
                  <Typography variant="body1">{Api.comma(detailOrder.order_cost)} 원</Typography>
                </Box>
                <Box fontSize={14} className={order.orderBox}>
                  <Typography variant="body1" className={order.orderSubtitle}>포인트</Typography>
                  <Typography variant="body1">{Api.comma(detailOrder.order_point)} P</Typography>
                </Box>
                <Box fontSize={14} className={order.orderBox}>
                  <Typography variant="body1" className={order.orderSubtitle}>쿠폰할인</Typography>
                  <Typography variant="body1">{Api.comma(detailOrder.order_coupon)} 원</Typography>
                </Box>
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                <Box fontSize={14} className={order.orderBox} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                  <Typography variant="subtitle1" className={order.orderSubtitle} style={{ fontWeight: 'bold' }}>총 결제금액</Typography>
                  <Typography variant="h6">{Api.comma(detailOrder.order_sumprice)} 원</Typography>
                </Box>
                <Box fontSize={14} className={order.orderBox}>
                  <Typography variant="body1" className={order.orderSubtitle}>결제방법</Typography>
                  <Typography variant="body1">{detailOrder.od_settle_case}</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
          :
          <Typography variant="h6" component="h4">잠시만 기다려주세요</Typography>
        }
      </MainBox>
    </Box>
  );
}
