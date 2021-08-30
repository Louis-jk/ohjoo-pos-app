import React from 'react';
import { useSelector } from 'react-redux';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/core/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

// Local Component
import Header from '../components/Header';
import Api from '../Api';
import { theme, MainBox, baseStyles, ModalCancelButton, ModalConfirmButton } from '../styles/base';

interface IProps {
  props: object;
}
interface IOption {
  [key: string]: string
}

interface IStoreInfo {
  do_jumju_introduction: string;
  do_jumju_info: string;
  do_jumju_guide: string;
  do_jumju_menu_info: string;
  do_major_menu: string;
  do_jumju_origin: string;
  do_jumju_origin_use: string;
  do_take_out: string;
  do_coupon_use: string;
  do_delivery_guide: string;
  do_delivery_time: string;
  do_end_state: string;
  mb_one_saving: string;
}

export default function StoreInfo(props: IProps) {

  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);
  const base = baseStyles();
  const [isLoading, setLoading] = React.useState(false);

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

  // 매장소개 정보
  const [storeInit, setStoreInit] = React.useState(false); // 매장 정보 초기값 유무
  const [info, setInfo] = React.useState<IStoreInfo>({
    do_jumju_introduction: '', // 매장소개
    do_jumju_info: '', // ??
    do_jumju_guide: '', // 안내 및 혜택
    do_jumju_menu_info: '', // 메뉴 소개
    do_major_menu: '', // 대표메뉴
    do_jumju_origin: '', // 원산지 안내
    do_jumju_origin_use: '', // 원산지 표시 유무
    do_take_out: '', // 포장 가능 유무
    do_coupon_use: '', // 쿠폰 사용 유무
    do_delivery_guide: '', // 배달 안내
    do_delivery_time: '', // 평균 배달 시간
    do_end_state: '', // 주문마감
    mb_one_saving: '', // 1인분 가능
  });

  const getStoreInfo = () => {

    setLoading(true);

    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code
    };

    Api.send('store_guide', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        setStoreInit(true);
        setInfo({
          do_jumju_introduction: arrItems.do_jumju_introduction,
          do_jumju_info: arrItems.do_jumju_info,
          do_jumju_guide: arrItems.do_jumju_guide,
          do_jumju_menu_info: arrItems.do_jumju_menu_info,
          do_major_menu: arrItems.do_major_menu,
          do_jumju_origin: arrItems.do_jumju_origin,
          do_jumju_origin_use: arrItems.do_jumju_origin_use,
          do_take_out: arrItems.do_take_out,
          do_coupon_use: arrItems.do_coupon_use,
          do_delivery_guide: arrItems.do_delivery_guide,
          do_delivery_time: arrItems.do_delivery_time,
          do_end_state: arrItems.do_end_state,
          mb_one_saving: arrItems.mb_one_saving
        });
        setLoading(false);
      } else {
        setStoreInit(false);
        setInfo({
          do_jumju_introduction: '',
          do_jumju_info: '',
          do_jumju_guide: '',
          do_jumju_menu_info: '',
          do_major_menu: '',
          do_jumju_origin: '',
          do_jumju_origin_use: '',
          do_take_out: '',
          do_coupon_use: '',
          do_delivery_guide: '',
          do_delivery_time: '',
          do_end_state: '',
          mb_one_saving: ''
        });
        setLoading(false);
      }
    });
  };

  React.useEffect(() => {
    getStoreInfo();
  }, [mt_id, mt_jumju_code])

  const updateStoreInfo = () => {

    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      mode: storeInit ? 'update' : 'insert',
      do_jumju_introduction: info.do_jumju_introduction,
      do_jumju_info: info.do_jumju_info,
      do_jumju_guide: info.do_jumju_guide,
      do_jumju_menu_info: info.do_jumju_menu_info,
      do_major_menu: info.do_major_menu,
      do_jumju_origin: info.do_jumju_origin,
      do_jumju_origin_use: info.do_jumju_origin_use,
      do_take_out: info.do_take_out,
      do_coupon_use: info.do_coupon_use,
      do_delivery_guide: info.do_delivery_guide,
      do_delivery_time: info.do_delivery_time,
      do_end_state: info.do_end_state,
      mb_one_saving: info.mb_one_saving
    };

    Api.send('store_guide_update', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        if (storeInit) {
          setToastState({ msg: '매장소개가 수정 되었습니다.', severity: 'success' });
          handleOpenAlert();
        } else {
          setToastState({ msg: '매장소개가 등록 되었습니다.', severity: 'success' });
          handleOpenAlert();
        }

      } else {
        if (storeInit) {
          setToastState({ msg: '매장소개를 수정하는 중에 오류가 발생하였습니다.\n관리자에게 문의해주세요.', severity: 'error' });
          handleOpenAlert();
        } else {
          setToastState({ msg: '매장소개를 등록하는 중에 오류가 발생하였습니다.\n관리자에게 문의해주세요.', severity: 'error' });
          handleOpenAlert();
        }
      }
    });

  }

  return (
    <Box component="div" className={base.root}>
      <Header type="storeInfo" action={updateStoreInfo} />
      <Box className={base.alert}>
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
      {isLoading ?
        <MainBox component='main' sx={{ flexGrow: 1, p: 3 }}>
          <Box className={base.loadingWrap}>
            <CircularProgress disableShrink color="primary" style={{ width: 50, height: 50 }} />
          </Box>
        </MainBox>
        :
        <MainBox component='main' sx={{ flexGrow: 1, p: 3 }}>
          <Box mt={3} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                value={info.do_jumju_introduction === null || info.do_jumju_introduction === undefined ? '' : info.do_jumju_introduction}
                fullWidth
                className={base.multiTxtField}
                id="outlined-multiline-static"
                label="매장소개"
                multiline
                rows={5}
                defaultValue="매장소개를 작성해주세요."
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
                onChange={e => setInfo({
                  ...info,
                  do_jumju_introduction: e.target.value as string
                })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                value={info.do_delivery_guide === null || info.do_delivery_guide === undefined ? '' : info.do_delivery_guide}
                fullWidth
                className={base.multiTxtField}
                id="outlined-multiline-static"
                label="배달팁 안내"
                multiline
                rows={5}
                defaultValue="배달팁 안내를 작성해주세요."
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
                onChange={e => setInfo({
                  ...info,
                  do_delivery_guide: e.target.value as string
                })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                value={info.do_jumju_menu_info === null || info.do_jumju_menu_info === undefined ? '' : info.do_jumju_menu_info}
                fullWidth
                className={base.multiTxtField}
                id="outlined-multiline-static"
                label="메뉴소개"
                multiline
                rows={9}
                defaultValue="메뉴소개를 작성해주세요."
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
                onChange={e => setInfo({
                  ...info,
                  do_jumju_menu_info: e.target.value as string
                })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                value={info.do_major_menu === null || info.do_major_menu === undefined ? '' : info.do_major_menu}
                fullWidth
                className={base.multiTxtField}
                id="outlined-multiline-static"
                label="대표메뉴"
                multiline
                rows={2}
                defaultValue="대표메뉴를 작성해주세요."
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
                onChange={e => setInfo({
                  ...info,
                  do_major_menu: e.target.value as string
                })}
              />
              <Typography variant="caption" color="primary">※ 대표메뉴가 여러개일 경우, 쉼표(,)로 구분하여 입력해주세요.</Typography>
              <div style={{ marginTop: 10, marginBottom: 20 }}></div>
              <TextField
                value={info.do_jumju_origin === null || info.do_jumju_origin === undefined ? '' : info.do_jumju_origin}
                fullWidth
                className={base.multiTxtField}
                id="outlined-multiline-static"
                label="원산지 안내"
                multiline
                rows={4}
                defaultValue="원산지 안내를 작성해주세요."
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
                onChange={e => setInfo({
                  ...info,
                  do_jumju_origin: e.target.value as string
                })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                value={info.do_delivery_time === null || info.do_delivery_time === undefined ? '' : info.do_delivery_time}
                fullWidth
                id="outlined-basic"
                label="평균 배달시간"
                variant="outlined"
                defaultValue="평균 배달시간을 입력해주세요."
                InputLabelProps={{
                  shrink: true
                }}
                onChange={e => setInfo({
                  ...info,
                  do_delivery_time: e.target.value as string
                })}
              />
            </Grid>
            {/* <Button variant="contained" color="primary" fullWidth>등록하기</Button> */}
          </Grid>
          <Box className={base.mb10}></Box>
          <Grid item xs={12} md={6}>
            <FormControl component="fieldset">
              <RadioGroup row aria-label="position" name="position" defaultValue="N">
                <FormControlLabel
                  value={'Y'}
                  checked={info.do_take_out === 'Y' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="포장가능"
                  labelPlacement="start"
                  style={{ width: 150, margin: 0, flexDirection: 'row' }}
                  onChange={e => setInfo({
                    ...info,
                    do_take_out: 'Y'
                  })}
                />
                <FormControlLabel
                  value={'N'}
                  checked={info.do_take_out === 'N' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="포장불가능"
                  labelPlacement="start"
                  style={{ width: 150, margin: 0, flexDirection: 'row' }}
                  onChange={e => setInfo({
                    ...info,
                    do_take_out: 'N'
                  })}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl component="fieldset">
              <RadioGroup row aria-label="position" name="position" defaultValue="N">
                <FormControlLabel
                  value={'Y'}
                  checked={info.do_coupon_use === 'Y' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="쿠폰 사용 가능"
                  labelPlacement="start"
                  style={{ width: 150, margin: 0, flexDirection: 'row' }}
                  onChange={e => setInfo({
                    ...info,
                    do_coupon_use: 'Y'
                  })}
                />
                <FormControlLabel
                  value={'N'}
                  checked={info.do_coupon_use === 'N' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="쿠폰 사용 불가능"
                  labelPlacement="start"
                  style={{ width: 150, margin: 0, flexDirection: 'row' }}
                  onChange={e => setInfo({
                    ...info,
                    do_coupon_use: 'N'
                  })}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </MainBox>
      }
    </Box>
  );
}