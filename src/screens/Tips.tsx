import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

// Material UI Components
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/core/Alert';
import Pagination from '@material-ui/core/Pagination';
import Stack from '@material-ui/core/Stack';

// Material icons
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import CircularProgress from '@material-ui/core/CircularProgress';

// Local Component
import Header from '../components/Header';
import Api from '../Api';
import { theme, MainBox, baseStyles } from '../styles/base';
import { ModalCancelButton, ModalConfirmButton } from '../styles/customButtons';

interface State {
  amount: string;
  password: string;
  weight: string;
  weightRange: string;
  showPassword: boolean;
}

interface ITips {
  dd_id: string;
  dd_charge_start: string;
  dd_charge_end: string;
  dd_charge_price: string;
}

export default function Tips(props: any) {

  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);

  const base = baseStyles();
  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // 페이지 현재 페이지
  const [startOfIndex, setStartOfIndex] = useState(0); // 페이지 API 호출 start 인덱스
  const [postPerPage, setPostPerPage] = useState(3); // 페이지 API 호출 Limit
  const [totalCount, setTotalCount] = useState(0); // 아이템 전체 갯수
  const [lists, setLists] = useState<ITips[]>([
    {
      dd_id: '',
      dd_charge_start: '',
      dd_charge_end: '',
      dd_charge_price: ''
    }
  ]);

  const [tipId, setTipId] = useState(''); // 배달팁 아이디
  const [minPrice, setMinPrice] = useState(''); // 최소금액 설정 
  const [maxPrice, setMaxPrice] = useState(''); // 최대금액 설정 
  const [tipPrice, setTipPrice] = useState(''); // 배달비 설정 

  // 배달팁 작성 모달 관리
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // 배달팁 삭제 모달 관리
  const [openTip, setOpenTip] = useState(false);

  const handleOpenTip = () => {
    setOpenTip(true);
  };

  const handleCloseTip = () => {
    setOpenTip(false);
  };

  // Toast(Alert) 관리
  const [toastState, setToastState] = useState({
    msg: '',
    severity: ''
  });
  const [openAlert, setOpenAlert] = useState(false);
  const handleOpenAlert = () => {
    setOpenAlert(true);
  };
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  // 등록된 팁 정보 가져오기
  const getTipsHandler = () => {

    setLoading(true);

    const param = {
      item_count: startOfIndex,
      limit_count: postPerPage,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code
    };

    Api.send('store_delivery', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      let toTotalCount = Number(resultItem.total_cnt);
      setTotalCount(toTotalCount);

      let totalPage = Math.ceil(toTotalCount / postPerPage);

      setTotalCount(totalPage);

      if (resultItem.result === 'Y') {
        setLists(arrItems);
        setLoading(false);
      } else {
        setLists([]);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    getTipsHandler();
  }, [mt_id, mt_jumju_code, startOfIndex]);


  // 페이지 전환 핸들러
  const pageHandleChange = (event: any, value: any) => {

    if (value === 1 || value < 1) {
      setStartOfIndex(0);
    } else {
      let start = (value - 1) * postPerPage;
      setStartOfIndex(start);
    }
    setCurrentPage(value);
  }

  // 배달팁 설정 초기화
  const initializeState = () => {
    setMinPrice('');
    setMaxPrice('');
    setTipPrice('');
  }

  // 배달팁 등록
  const onSubmitTips = () => {
    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      charge_start: minPrice,
      charge_end: maxPrice,
      charge_price: tipPrice,
      mode: 'insert'
    };

    Api.send('store_delivery_input', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;
      if (resultItem.result === 'Y') {
        setToastState({ msg: '새로운 배달팁이 등록 되었습니다.', severity: 'success' });
        handleOpenAlert();
        handleClose();
        initializeState();
        getTipsHandler();
      } else {
        setToastState({ msg: '배달팁을 등록하는 중에 오류가 발생하였습니다.\n관리자에게 문의해주세요.', severity: 'error' });
        handleOpenAlert();
        handleClose();
        initializeState();
      }
    });
  }

  // 배달팁 등록 전 체크
  const onSubmitHandler = () => {
    if (minPrice === null || minPrice === '') {
      setToastState({ msg: '최소주문금액을 입력해주세요.', severity: 'error' });
      handleOpenAlert();
    } else if (tipPrice === null || tipPrice === '') {
      setToastState({ msg: '배달비를 입력해주세요.', severity: 'error' });
      handleOpenAlert();
    } else {
      onSubmitTips();
    }
  }

  // 배달팁 삭제
  const deleteTipHandler = () => {
    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      mode: 'delete',
      dd_id: tipId
    };

    Api.send('store_delivery_input', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;
      if (resultItem.result === 'Y') {
        setToastState({ msg: '배달팁이 삭제 되었습니다.', severity: 'success' });
        handleOpenAlert();
        handleCloseTip();
        getTipsHandler();
      } else {
        setToastState({ msg: '배달팁 삭제를 실패하였습니다.', severity: 'error' });
        handleOpenAlert();
        handleCloseTip();
      }
    });
  }

  // 배달팁 삭제 전 체크
  const deleteTipConfirmHandler = (id: string) => {
    setTipId(id);
    handleOpenTip();
  }

  return (
    <Box component="div" className={base.root}>
      <Header type="tips" action={handleOpen} />
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
      {/* 배달팁 입력 모달 */}
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
          <Box className={base.modalInner}>
            <Typography component="h2" id="transition-modal-title" style={{ fontSize: 20 }}>배달팁 입력</Typography>
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
              onClick={handleClose}
              style={{
                position: 'absolute',
                top: -10,
                right: -10,
                width: 30,
                height: 30,
                color: '#fff',
                backgroundColor: theme.palette.primary.main
              }}
            >
              <CloseRoundedIcon />
            </IconButton>
            <Paper className={base.paper}>
              <Box className={base.txtRoot}>
                <TextField
                  value={minPrice}
                  className={base.textField}
                  fullWidth
                  id="outlined-basic"
                  label="최소주문금액"
                  variant="outlined"
                  required
                  onChange={e => setMinPrice(e.target.value as string)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">원 이상</InputAdornment>,
                  }}
                />
              </Box>
              <Box className={base.txtRoot}>
                <TextField
                  value={maxPrice}
                  className={base.textField}
                  fullWidth
                  id="outlined-basic"
                  label="최대주문금액"
                  variant="outlined"
                  required
                  onChange={e => setMaxPrice(e.target.value as string)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">원 미만</InputAdornment>,
                  }}
                />
              </Box>
              <p className={base.mb20}>위 금액일 경우, 아래 배달비 적용</p>
              <Box className={base.txtRoot}>
                <TextField
                  value={tipPrice}
                  className={base.textField}
                  fullWidth
                  id="outlined-basic"
                  label="배달비"
                  variant="outlined"
                  required
                  onChange={e => setTipPrice(e.target.value as string)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">원</InputAdornment>,
                  }}
                />
              </Box>
            </Paper>
            <ButtonGroup variant="text" color="primary" aria-label="text primary button group" style={{ marginTop: 20 }}>
              <ModalConfirmButton variant="contained" style={{ boxShadow: 'none' }} onClick={onSubmitHandler}>등록하기</ModalConfirmButton>
              <ModalCancelButton variant="outlined" onClick={handleClose}>닫기</ModalCancelButton>
            </ButtonGroup>
          </Box>
        </Fade>
      </Modal>
      {/* // 배달팁 입력 모달 */}
      {/* 배달팁 삭제 모달 */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={base.modal}
        open={openTip}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openTip}>
          <Box className={base.modalInner}>
            <h3 className={base.modalTitle}>배달팁 삭제</h3>
            <p className={base.modalDescription}>선택하신 배달팁을 삭제하시겠습니까?</p>
            <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
              <ModalConfirmButton variant="contained" style={{ boxShadow: 'none' }} onClick={deleteTipHandler}>예</ModalConfirmButton>
              <ModalCancelButton variant="outlined" onClick={handleCloseTip}>아니요</ModalCancelButton>
            </ButtonGroup>
          </Box>
        </Fade>
      </Modal>
      {/* 배달팁 삭제 모달 */}
      {isLoading ?
        <Box className={base.loadingWrap}>
          <CircularProgress disableShrink color="primary" style={{ width: 50, height: 50 }} />
        </Box>
        :
        <MainBox component='main' sx={{ flexGrow: 1, p: 3 }}>
          <Grid container spacing={3}>
            {lists && lists.length > 0 && lists.map((list, index) =>
              <Grid item xs={6} sm={6} md={4} key={list.dd_id} style={{ position: 'relative' }}>
                <IconButton
                  color="primary"
                  aria-label="delete"
                  component="span"
                  onClick={() => deleteTipConfirmHandler(list.dd_id)}
                  style={{
                    position: 'absolute',
                    top: 15,
                    right: -7,
                    width: 25,
                    height: 25,
                    color: '#fff',
                    backgroundColor: theme.palette.primary.main
                  }}
                >
                  <CloseRoundedIcon />
                </IconButton>
                <Paper className={clsx(base.paper, base.gradient, base.boxBlur, base.border)} style={{ background: "linear-gradient(45deg, #FFF6da, #FFF5DA)" }}>
                  <Box className={base.txtRoot}>
                    <TextField
                      value={list.dd_charge_start}
                      variant="outlined"
                      label="최소금액"
                      style={{ backgroundColor: '#fff' }}
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{
                        endAdornment: <InputAdornment position="start">원 이상</InputAdornment>
                      }}
                      contentEditable={false}
                    />
                  </Box>
                  <Box className={base.txtRoot}>
                    <TextField
                      value={list.dd_charge_end}
                      variant="outlined"
                      label="최대금액"
                      style={{ backgroundColor: '#fff' }}
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{
                        endAdornment: <InputAdornment position="start">원 미만</InputAdornment>
                      }}
                      contentEditable={false}
                    />
                  </Box>
                  <Typography mb={3}>위 금액일 경우, 아래 배달비 적용</Typography>
                  <Box className={base.txtRoot}>
                    <TextField
                      value={list.dd_charge_price}
                      variant="outlined"
                      label="배달비"
                      style={{ backgroundColor: '#fff' }}
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{
                        endAdornment: <InputAdornment position="start">원</InputAdornment>
                      }}
                      contentEditable={false}
                    />
                  </Box>
                </Paper>
              </Grid>
            )}
          </Grid>
          {lists.length === 0 || lists === null ?
            <Box style={{ display: 'flex', flex: 1, height: '80vh', justifyContent: 'center', alignItems: 'center' }}>
              <Typography style={{ fontSize: 15 }}>등록된 배달팁이 없습니다.</Typography>
            </Box>
            : null}
          <Box mt={10} display='flex' justifyContent='center' alignSelf="center">
            <Stack spacing={2}>
              <Pagination
                color="primary"
                count={totalCount}
                defaultPage={1}
                showFirstButton
                showLastButton
                onChange={pageHandleChange}
                page={currentPage}
              />
              {/* 
                토탈 페이지수 = count
                초기 페이지 번호 = defaultPage
              */}
            </Stack>
          </Box>
        </MainBox>
      }
    </Box>
  );
}