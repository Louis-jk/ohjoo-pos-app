import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

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
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

// Local Component
import Header from '../components/Header';
import Api from '../Api';
import { theme, MainBox, baseStyles, ModalCancelButton, ModalConfirmButton } from '../styles/base';
import appRuntime from '../appRuntime';
import clsx from 'clsx';
import loginAction from '../redux/actions';
import { ButtonGroup, Divider } from '@material-ui/core';

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
  mt_sound: string;
  mt_print: string;
  mb_one_saving: string;
}

type RangeType = 'all' | 'curr';

export default function StoreInfo(props: IProps) {

  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);
  const base = baseStyles();
  const [isLoading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const [range, setRange] = useState<RangeType>('curr');

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
    mt_sound: '', // 알림 횟수
    mt_print: '', // 주문 접수시 자동프린트 유무 (1: true / 0: false)
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
          mt_sound: arrItems.mt_sound,
          mt_print: arrItems.mt_print,
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
          mt_sound: '',
          mt_print: '',
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
      mt_sound: info.mt_sound,
      mt_print: info.mt_print,
      mb_one_saving: info.mb_one_saving
    };

    Api.send('store_guide_update', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        dispatch(loginAction.updateNotify(info.mt_sound));
        dispatch(loginAction.updateAutoPrint(info.mt_print));
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
      <Header type="storeSetting" action={updateStoreInfo} />
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
        <MainBox component='main' sx={{ flexGrow: 1, p: 3 }} style={{ borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
          <Box className={base.loadingWrap}>
            <CircularProgress disableShrink color="primary" style={{ width: 50, height: 50 }} />
          </Box>
        </MainBox>
        :
        <MainBox component='main' sx={{ flexGrow: 1, p: 3 }} style={{ borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
          <Box mt={3} />
          <Box className={clsx(base.mb10, base.mt20)}></Box>
          <Grid item xs={12} md={6} mb={2}>
            <Typography fontWeight='bold'>알림 설정</Typography>
            <FormControl component="fieldset">
              <RadioGroup row aria-label="position" name="position" defaultValue="N">
                <FormControlLabel
                  value={'1'}
                  checked={info.mt_sound === '1' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="1회 알림"
                  labelPlacement="start"
                  style={{ width: 110, margin: 0, flexDirection: 'row' }}
                  onChange={e => {
                    setInfo({
                      ...info,
                      mt_sound: '1'
                    });
                    appRuntime.send('sound_count', '1');
                  }}
                />
                <FormControlLabel
                  value={'2'}
                  checked={info.mt_sound === '2' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="2회 알림"
                  labelPlacement="start"
                  style={{ width: 110, margin: 0, flexDirection: 'row' }}
                  onChange={e => {
                    setInfo({
                      ...info,
                      mt_sound: '2'
                    });
                    appRuntime.send('sound_count', '2');
                  }}
                />
                <FormControlLabel
                  value={'3'}
                  checked={info.mt_sound === '3' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="3회 알림"
                  labelPlacement="start"
                  style={{ width: 110, margin: 0, flexDirection: 'row' }}
                  onChange={e => {
                    setInfo({
                      ...info,
                      mt_sound: '3'
                    });
                    appRuntime.send('sound_count', '3');
                  }}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} mb={2}>
            <Typography fontWeight='bold'>주문 접수시 자동 프린트 여부</Typography>
            <FormControl component="fieldset">
              <RadioGroup row aria-label="position" name="position" defaultValue="N">
                <FormControlLabel
                  value={'1'}
                  checked={info.mt_print === '1' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="자동출력"
                  labelPlacement="start"
                  style={{ width: 110, margin: 0, flexDirection: 'row' }}
                  onChange={e => {
                    setInfo({
                      ...info,
                      mt_print: '1'
                    });
                  }}
                />
                <FormControlLabel
                  value={'0'}
                  checked={info.mt_print === '0' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="출력안함"
                  labelPlacement="start"
                  style={{ width: 110, margin: 0, flexDirection: 'row' }}
                  onChange={e => {
                    setInfo({
                      ...info,
                      mt_print: '0'
                    });
                  }}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} mb={2}>
            <Typography fontWeight='bold'>주문 포장 가능 여부</Typography>
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
          <Grid item xs={12} md={6} mb={2}>
            <FormControl component="fieldset">
              <Typography fontWeight='bold'>쿠폰 사용 가능 여부</Typography>
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

          <Grid item xs={12} md={6} mb={2} mt={7}>
            <ButtonGroup variant='outlined'>
              <Button variant={range === 'all' ? 'contained' : 'outlined'} sx={{ px: 5, py: 1.5, boxShadow: 'none !important' }} onClick={() => setRange('all')}>전체 매장 적용</Button>
              <Button variant={range === 'curr' ? 'contained' : 'outlined'} sx={{ px: 5, py: 1.5, boxShadow: 'none !important' }} onClick={() => setRange('curr')}>해당 매장만 적용</Button>
            </ButtonGroup>
          </Grid>
        </MainBox>
      }
    </Box>
  );
}