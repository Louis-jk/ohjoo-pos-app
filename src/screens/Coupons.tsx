import * as React from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';

// Material UI Components
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/core/Alert';

// Material icons
import IconButton from '@material-ui/core/IconButton';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import CircularProgress from '@material-ui/core/CircularProgress';

// Local Component
import Header from '../components/Header';
import Api from '../Api';
import { theme, MainBox, baseStyles, ModalCancelButton, ModalConfirmButton } from '../styles/base';
import { CouponStyles } from '../styles/custom';

interface State {
  amount: string;
  password: string;
  weight: string;
  weightRange: string;
  showPassword: boolean;
}

interface ICoupon {
  cz_download: string;
  cz_end: string;
  cz_maximum: string;
  cz_method: string;
  cz_minimum: string;
  cz_no: string;
  cz_period: string;
  cz_price: string;
  cz_price_type: string;
  cz_start: string;
  cz_subject: string;
  cz_target: string;
  cz_type: string;
}

export default function Tips(props: any) {

  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);

  const base = baseStyles();
  const coupon = CouponStyles();

  const [isLoading, setLoading] = React.useState(false);
  const [lists, setLists] = React.useState<ICoupon[]>([
    {
      cz_download: '',
      cz_end: '',
      cz_maximum: '',
      cz_method: '',
      cz_minimum: '',
      cz_no: '',
      cz_period: '',
      cz_price: '',
      cz_price_type: '',
      cz_start: '',
      cz_subject: '',
      cz_target: '',
      cz_type: '',
    }
  ]);
  const [couponId, setCouponId] = React.useState('');

  // Toast(Alert) 설정 값
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

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteCouponConfirmHandler = (coupon_id: string) => {
    setCouponId(coupon_id);
    setOpen(true);
  }
  console.log("couponId :: ", couponId);

  const deleteCouponHandler = () => {
    let param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      cz_no: couponId
    };

    Api.send('store_couponzone_delete', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        setToastState({ msg: '쿠폰이 삭제되었습니다.', severity: 'success' });
        handleOpenAlert();
        handleClose();
        getCouponListHandler();
      } else {
        setToastState({ msg: '쿠폰을 삭제하는 중 오류가 발생하였습니다.', severity: 'error' });
        handleOpenAlert();
        handleClose();
      }
    });
  }

  const getCouponListHandler = () => {

    setLoading(true);

    let param = {
      item_count: 0,
      limit_count: 10,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
    };

    Api.send('store_couponzone_list', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        console.log('쿠폰 리스트 :: ', arrItems);
        setLists(arrItems);
        setLoading(false);
      } else {
        setLists([]);
        setLoading(false);
      }
    });
  };

  React.useEffect(() => {
    getCouponListHandler();
  }, [mt_id, mt_jumju_code]);


  return (
    <Box component="div" className={base.root}>
      <Header type="coupon" action={handleOpen} />
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
      {/* 쿠폰 삭제 모달 */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={coupon.couponModal}
        open={open}
        // onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box className={coupon.couponModalInner} style={{ zIndex: 99999 }}>
            <h2 id="transition-modal-title" className={base.modalTitle}>쿠폰 삭제</h2>
            <p id="transition-modal-description" className={base.modalDescription}>선택하신 쿠폰을 삭제하시겠습니까?</p>
            <ButtonGroup variant="text" aria-label="text primary button group">
              <ModalConfirmButton variant="contained" style={{ boxShadow: 'none' }} onClick={deleteCouponHandler}>예</ModalConfirmButton>
              <ModalCancelButton variant="outlined" onClick={handleClose}>아니요</ModalCancelButton>
            </ButtonGroup>
          </Box>
        </Fade>
      </Modal>
      {/* 쿠폰 삭제 모달 */}
      {isLoading ?
        <Box className={base.loadingWrap}>
          <CircularProgress disableShrink color="primary" style={{ width: 50, height: 50 }} />
        </Box>
        :
        <MainBox component='main' sx={{ flexGrow: 1, p: 3 }}>
          <Grid container spacing={3}>
            {lists && lists.length > 0 && lists.map((list, index) => (
              <Grid key={list.cz_no} item xs={12} md={6} style={{ position: 'relative' }}>
                <IconButton color="primary" aria-label="upload picture" component="span" onClick={() => deleteCouponConfirmHandler(list.cz_no)} style={{ position: 'absolute', top: 10, right: -10, width: 30, height: 30, color: '#fff', backgroundColor: '#53447A' }}>
                  <CloseRoundedIcon />
                </IconButton>
                <Paper className={clsx(base.paper, coupon.gradient)}>
                  <Typography variant="subtitle1" component="p" style={{ marginBottom: 10, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#53447A' }}>{list.cz_subject}</Typography>
                  <Box component="article" className={coupon.couponBox}>
                    <Typography variant="subtitle1" component="p" style={{ position: 'absolute', top: -14, color: '#000' }}>✂</Typography>
                    {list.cz_price_type === '1' ?
                      <Typography variant="h5" component="em" className={coupon.couponPrice}>{list.cz_price}%</Typography>
                      :
                      <Typography variant="h5" component="em" className={coupon.couponPrice}>{Api.comma(list.cz_price)}원</Typography>
                    }
                  </Box>

                  <Typography variant="body1" component="p" style={{ fontSize: 13, marginBottom: 5 }}>{`최소주문금액 ${Api.comma(list.cz_minimum)}원 - 최대주문금액 ${Api.comma(list.cz_maximum)}원`}</Typography>

                  <Typography variant="body1" component="p" style={{ fontSize: 13 }}>쿠폰사용기간</Typography>
                  <Typography variant="body1" component="p" style={{ fontSize: 13 }}>{`${list.cz_start} - ${list.cz_end}`}</Typography>
                </Paper>
              </Grid>
            )
            )}
          </Grid>
          {lists.length === 0 || lists === null ?
            <Box style={{ display: 'flex', flex: 1, height: '80vh', justifyContent: 'center', alignItems: 'center' }}>
              <Typography style={{ fontSize: 15 }}>등록된 쿠폰이 없습니다.</Typography>
            </Box>
            : null}
        </MainBox>
      }
    </Box>
  );
}