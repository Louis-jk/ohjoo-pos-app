import * as React from 'react';
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux';
import MomentUtils from '@date-io/moment';
import moment from "moment";
import "moment/locale/ko";
import clsx from 'clsx';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import { alpha } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/core/Alert';
import Select, { SelectChangeEvent } from '@material-ui/core/Select';
import Box from '@material-ui/core/Box';
import Stack from '@material-ui/core/Stack';
import { koKR } from '@material-ui/core/locale';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import DateRangePicker, { DateRange } from '@material-ui/lab/DateRangePicker';

// Local Component
import Header from '../components/Header';
import Api from '../Api';
import { theme, MainBox, baseStyles, ModalCancelButton, ModalConfirmButton } from '../styles/base';

type DiscountType = 'currency' | 'ratio'; // 할인금액 | 할인율


export default function CouponAdd() {

  const base = baseStyles();
  const history = useHistory();
  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);
  const [type, setType] = React.useState(''); // 쿠폰 구분
  const [name, setName] = React.useState(''); // 쿠폰명
  const [minPrice, setMinPrice] = React.useState(''); // 최소주문금액
  const [maxPrice, setMaxPrice] = React.useState(''); // 최대주문금액
  const [discountPrice, setDiscountPrice] = React.useState(''); // 할인금액 or 비율 값
  const [discountType, setDiscountType] = React.useState<DiscountType>('currency'); // 할인금액 or 비율 선택
  const [duration, setDuration] = React.useState(''); // 쿠폰사용기한
  const [value, setValue] = React.useState<DateRange<Date>>([null, null]); // 쿠폰 다운로드 유효기간

  const [selectedDate01, setSelectedDate01] = React.useState<Date | null>(
    new Date(),
  ); // 쿠폰 다운로드 유효기간 시작날짜
  const [selectedDate02, setSelectedDate02] = React.useState<Date | null>(
    new Date(),
  ); // 쿠폰 다운로드 유효기간 종료날짜

  // 쿠폰 구분 셀렉트 핸들러
  const handleChange = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
  };

  // 데이트픽커 핸들러
  const handleDateChange = (date: Date | null, type: string) => {
    if (type === 'start') {
      setSelectedDate01(date);
    } else {
      setSelectedDate02(date);
    }
  };

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

  // 쿠폰 등록하기
  const addCouponHandler = () => {
    let startDateFormat = moment(selectedDate01).format('YYYY-MM-DD');
    let endDateFormat = moment(selectedDate02).format('YYYY-MM-DD');
    // let toIntDiscountPrice = parseInt(discountPrice);
    let discountTypeFormat;
    if (discountType === 'currency') {
      discountTypeFormat = '0';
    } else {
      discountTypeFormat = '1';
    }

    let param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      cz_type: type,
      cz_subject: name,
      cz_start: startDateFormat,
      cz_end: endDateFormat,
      cz_period: duration,
      cz_price: discountPrice,
      cz_price_type: discountTypeFormat,
      cz_minimum: minPrice,
      cz_maximum: maxPrice
    };

    Api.send('store_couponzone_input', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        setToastState({ msg: '새로운 쿠폰이 등록 되었습니다.', severity: 'success' });
        handleOpenAlert();
        handleOpen();
      } else {
        setToastState({ msg: '쿠폰을 등록하는 중에 오류가 발생하였습니다.\n관리자에게 문의해주세요.', severity: 'error' });
        handleOpenAlert();
      }
    });
  }

  const addCouponConfirmHandler = () => {
    if (type === null || type === '') {
      setToastState({ msg: '구분(쿠폰타입)을 선택해주세요.', severity: 'error' });
      handleOpenAlert();
    } else if (name === null || name === '') {
      setToastState({ msg: '쿠폰명을 입력해주세요.', severity: 'error' });
      handleOpenAlert();
    } else if (minPrice === null || minPrice === '') {
      setToastState({ msg: '최소주문금액을 입력해주세요.', severity: 'error' });
      handleOpenAlert();
    } else if (maxPrice === null || maxPrice === '') {
      setToastState({ msg: '최대주문금액을 입력해주세요.', severity: 'error' });
      handleOpenAlert();
    } else if (discountPrice === null || discountPrice === '') {
      if (discountType === 'currency') {
        setToastState({ msg: '할인금액 입력해주세요.', severity: 'error' });
        handleOpenAlert();
      } else {
        setToastState({ msg: '할인율을 입력해주세요.', severity: 'error' });
        handleOpenAlert();
      }
    } else if (duration === null || duration === '') {
      setToastState({ msg: '쿠폰사용기한을 입력해주세요.', severity: 'error' });
      handleOpenAlert();
    } else {
      addCouponHandler();
    }
  }

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const stateInitializeHandler = () => {
    setType('');
    setName('');
    setMinPrice('');
    setMaxPrice('');
    setDiscountPrice('');
    setDiscountType('currency');
    setDuration('');
    setSelectedDate01(new Date());
    setSelectedDate02(new Date());
  }

  const reAddHandler = () => {
    // history.push('/couponAdd');
    stateInitializeHandler();
    handleClose();
  }

  const goBackList = () => {
    history.push('/coupons');
    handleClose();
  }

  return (
    <Box component="div">
      <Header type="couponAdd" action={addCouponConfirmHandler} />
      <div className={base.alert}>
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
      </div>
      {/* 쿠폰 입력 완료 모달 */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={base.modal}
        open={open}
        // onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={base.modalInner}>
            <h2 id="transition-modal-title" className={base.modalTitle}>쿠폰 등록 성공!</h2>
            <p id="transition-modal-description" className={base.modalDescription}>쿠폰을 추가로 등록하시겠습니까?</p>
            <ButtonGroup variant="text" aria-label="text primary button group">
              <ModalConfirmButton variant="contained" onClick={reAddHandler}>추가 등록하기</ModalConfirmButton>
              <ModalCancelButton variant="outlined" onClick={goBackList}>아니요</ModalCancelButton>
            </ButtonGroup>
          </div>
        </Fade>
      </Modal>
      {/* // 쿠폰 입력 완료 모달 */}

      <MainBox component='main' sx={{ flexGrow: 1, p: 3 }}>
        <Box style={{ marginBottom: 20 }}>
          <Typography variant="h5" component="h5">쿠폰 등록</Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">카테고리</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                label="카테고리"
                onChange={handleChange}
              >
                <MenuItem value={10}>모두 사용가능</MenuItem>
                <MenuItem value={20}>포장용 쿠폰</MenuItem>
                <MenuItem value={30}>배달용 쿠폰</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              value={name}
              fullWidth
              id="outlined-basic"
              label="쿠폰명"
              variant="outlined"
              required
              onChange={e => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              value={minPrice}
              fullWidth
              id="outlined-basic"
              label="최소주문금액"
              variant="outlined"
              required
              onChange={e => setMinPrice(e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">원</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              value={maxPrice}
              fullWidth
              id="outlined-basic"
              label="최대주문금액"
              variant="outlined"
              required
              onChange={e => setMaxPrice(e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">원</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              value={discountPrice}
              id="outlined-basic"
              label={discountType === 'currency' ? '할인금액' : '할인율'}
              variant="outlined"
              required
              style={{ width: '33%', marginRight: 10 }}
              onChange={e => setDiscountPrice(e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">{discountType === 'currency' ? '원' : '%'}</InputAdornment>,
              }}
            />
            <ButtonGroup variant="text" aria-label="text primary button group">
              <Button
                variant="outlined"
                style={{
                  height: 56,
                  width: 56,
                  fontWeight: 'bold',
                  color: discountType === 'currency' ? '#fff' : '#54447B',
                  backgroundColor: discountType === 'currency' ? '#54447B' : '#fff',
                }}
                onClick={() => setDiscountType('currency')}>
                원
              </Button>
              <Button
                variant="outlined"
                style={{
                  height: 56,
                  width: 56,
                  fontWeight: 'bold',
                  color: discountType === 'ratio' ? '#fff' : '#54447B',
                  backgroundColor: discountType === 'ratio' ? '#54447B' : '#fff',
                }}
                onClick={() => setDiscountType('ratio')}>
                %
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid item xs={12} md={12}>
            <Typography>다운로드 유효기간</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <p>시작날짜</p>
              </Grid>
              <Grid item xs={12} md={6}>
                <p>종료날짜</p>
              </Grid>
            </Grid>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateRangePicker
                startText="시작날짜"
                endText="종료날짜"
                calendars={2}
                value={value}
                onChange={(newValue) => {
                  console.log("newValue", newValue);
                  setValue(newValue);
                }}
                renderInput={(startProps, endProps) => (
                  <React.Fragment>
                    <TextField {...startProps} />
                    <Box sx={{ mx: 2 }}> 부터 </Box>
                    <TextField {...endProps} />
                  </React.Fragment>
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              value={duration}
              fullWidth
              name="numberformat"
              id="outlined-basic"
              label="쿠폰사용기한"
              variant="outlined"
              required
              onChange={e => setDuration(e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">일</InputAdornment>,
                // inputComponent: NumberFormatCustom as any,
              }}
            />
            <FormHelperText id="outlined-weight-helper-text">쿠폰사용 가능한 일자를 입력해주세요.</FormHelperText>
          </Grid>
        </Grid>

      </MainBox>
    </Box>

  )
}