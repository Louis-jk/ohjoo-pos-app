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

interface IStoreSetting {
  [key: string]: string
}

type RangeType = 'all' | 'curr';

export default function StoreInfo(props: IProps) {

  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);
  const base = baseStyles();
  const [isLoading, setLoading] = React.useState(true);
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
  const [setting, setSetting] = React.useState<IStoreSetting>({
    do_coupon_use: '', // 쿠폰 사용 가능 여부 'Y' | 'N'
    do_take_out: '', // 포장 가능 여부 'Y' | 'N'
    mt_print: '', // 자동출력 '1', 출력안함 '0'
    mt_sound: '' // 사운드 울림 횟수
  });

  const getStoreSetting = () => {

    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code
    };

    Api.send('store_setting', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      console.log("매장소개 resultItem", resultItem);
      console.log("매장소개 arrItems", arrItems);

      if (resultItem.result === 'Y') {
        console.log("arrItems", arrItems);
        setStoreInit(true);
        setSetting({
          do_take_out: arrItems.do_take_out,
          do_coupon_use: arrItems.do_coupon_use,
          mt_sound: arrItems.mt_sound,
          mt_print: arrItems.mt_print
        });
        setLoading(false);
      } else {
        setStoreInit(false);
        setSetting({
          do_take_out: '',
          do_coupon_use: '',
          mt_sound: '',
          mt_print: ''
        });
        setLoading(false);
      }
    });
  };

  React.useEffect(() => {
    // window.addEventListener('getStoreSettings', getStoreSetting());
    // return () => {
    //   window.removeEventListener('getStoreSettings', getStoreSetting);
    // }
    getStoreSetting();
  }, [mt_id, mt_jumju_code])

  console.log('setting', setting);
  console.log('range', range);

  const updateStoreSetting = () => {

    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      mode: storeInit ? 'update' : 'insert',
      do_take_out: setting.do_take_out,
      do_coupon_use: setting.do_coupon_use,
      mt_sound: setting.mt_sound,
      mt_print: setting.mt_print,
      RangeType: range
    };

    console.log('매장설정 업데이트 param', param);
    // return false;

    Api.send('store_setting_update', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        dispatch(loginAction.updateNotify(setting.mt_sound));
        dispatch(loginAction.updateAutoPrint(setting.mt_print));
        if (storeInit) {
          setToastState({ msg: '매장설정이 수정 되었습니다.', severity: 'success' });
          handleOpenAlert();
        } else {
          setToastState({ msg: '매장설정이 등록 되었습니다.', severity: 'success' });
          handleOpenAlert();
        }

      } else {
        if (storeInit) {
          setToastState({ msg: '매장설정을 수정하는 중에 오류가 발생하였습니다.\n관리자에게 문의해주세요.', severity: 'error' });
          handleOpenAlert();
        } else {
          setToastState({ msg: '매장설정을 등록하는 중에 오류가 발생하였습니다.\n관리자에게 문의해주세요.', severity: 'error' });
          handleOpenAlert();
        }
      }
    });
  }

  return (
    <Box component="div" className={base.root}>
      <Header type="storeSetting" action={updateStoreSetting} />
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
          {/* <p>{mt_id}</p>
          <p>{mt_jumju_code}</p> */}
          <Box className={clsx(base.mb10, base.mt20)}></Box>
          <Grid item xs={12} md={6} mb={2}>
            <Typography fontWeight='bold'>알림 설정</Typography>
            <FormControl component="fieldset">
              <RadioGroup row aria-label="position" name="position" defaultValue="N">
                <FormControlLabel
                  value={'1'}
                  checked={setting.mt_sound === '1' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="1회 알림"
                  labelPlacement="start"
                  style={{ width: 110, margin: 0, flexDirection: 'row' }}
                  onChange={e => {
                    setSetting({
                      ...setting,
                      mt_sound: '1'
                    });
                    appRuntime.send('sound_count', '1');
                  }}
                />
                <FormControlLabel
                  value={'2'}
                  checked={setting.mt_sound === '2' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="2회 알림"
                  labelPlacement="start"
                  style={{ width: 110, margin: 0, flexDirection: 'row' }}
                  onChange={e => {
                    setSetting({
                      ...setting,
                      mt_sound: '2'
                    });
                    appRuntime.send('sound_count', '2');
                  }}
                />
                <FormControlLabel
                  value={'3'}
                  checked={setting.mt_sound === '3' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="3회 알림"
                  labelPlacement="start"
                  style={{ width: 110, margin: 0, flexDirection: 'row' }}
                  onChange={e => {
                    setSetting({
                      ...setting,
                      mt_sound: '3'
                    });
                    appRuntime.send('sound_count', '3');
                  }}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} mb={2}>
            <Typography fontWeight='bold'>주문 접수시 자동 프린트 출력 여부</Typography>
            <FormControl component="fieldset">
              <RadioGroup row aria-label="position" name="position" defaultValue="N">
                <FormControlLabel
                  value={'1'}
                  checked={setting.mt_print === '1' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="자동출력"
                  labelPlacement="start"
                  style={{ width: 110, margin: 0, flexDirection: 'row' }}
                  onChange={e => {
                    setSetting({
                      ...setting,
                      mt_print: '1'
                    });
                  }}
                />
                <FormControlLabel
                  value={'0'}
                  checked={setting.mt_print === '0' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="출력안함"
                  labelPlacement="start"
                  style={{ width: 110, margin: 0, flexDirection: 'row' }}
                  onChange={e => {
                    setSetting({
                      ...setting,
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
                  checked={setting.do_take_out === 'Y' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="포장가능"
                  labelPlacement="start"
                  style={{ width: 150, margin: 0, flexDirection: 'row' }}
                  onChange={e => setSetting({
                    ...setting,
                    do_take_out: 'Y'
                  })}
                />
                <FormControlLabel
                  value={'N'}
                  checked={setting.do_take_out === 'N' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="포장불가능"
                  labelPlacement="start"
                  style={{ width: 150, margin: 0, flexDirection: 'row' }}
                  onChange={e => setSetting({
                    ...setting,
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
                  checked={setting.do_coupon_use === 'Y' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="쿠폰 사용 가능"
                  labelPlacement="start"
                  style={{ width: 150, margin: 0, flexDirection: 'row' }}
                  onChange={e => setSetting({
                    ...setting,
                    do_coupon_use: 'Y'
                  })}
                />
                <FormControlLabel
                  value={'N'}
                  checked={setting.do_coupon_use === 'N' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="쿠폰 사용 불가능"
                  labelPlacement="start"
                  style={{ width: 150, margin: 0, flexDirection: 'row' }}
                  onChange={e => setSetting({
                    ...setting,
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