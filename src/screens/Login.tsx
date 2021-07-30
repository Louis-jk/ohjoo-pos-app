import * as React from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import Logo from '../assets/images/logo_bk.png';
import Api from '../Api';
import loginAction from '../redux/actions';
import { getToken, onMessageListener } from '../firebaseConfig';
import { LoginContainer, baseStyles, MyButton } from '../styles/base';

interface State {
  email: string;
  password: string;
  isAutoLogin: boolean;
  showPassword: boolean;
}

export default function Login() {

  const dispatch = useDispatch();
  const history = useHistory();
  const base = baseStyles();

  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);

  const [token, setToken] = React.useState('');
  const [values, setValues] = React.useState<State>({
    email: '',
    password: '',
    isAutoLogin: false,
    showPassword: false,
  });

  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleClickAutoLogin = () => {
    setValues({ ...values, isAutoLogin: !values.isAutoLogin });
  };

  // 

  // 자동 로그인 처리
  const storeData = async () => {
    try {
      const jsonValue = JSON.stringify({
        userId: values.email,
        userPwd: values.password
      })
      await localStorage.setItem('userAccount', jsonValue);
      alert('로컬스토리지 저장');
    } catch (e) {
      alert(`${e} :: 관리자에게 문의하세요.`);
    }
  }

  //  자동 토큰 저장
  // const storeAddToken = async () => {
  //   try {
  //     const jsonValue = JSON.stringify({ token: temFcmToken });
  //     await localStorage.setItem('ohjooStoreToken', jsonValue);
  //   } catch (e) {
  //     alert(`${e} :: 관리자에게 문의하세요.`);
  //   }
  // };

  const onLoginHandler = () => {
    // setLoading(true);

    const param = {
      mt_id: values.email,
      mt_pwd: values.password,
      mt_app_token: token
    };

    Api.send('store_login', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        if (values.isAutoLogin) {
          storeData();
        }
        // storeAddToken();
        dispatch(loginAction.updateLogin(JSON.stringify(arrItems)));
        history.replace('/main');
        // setLoading(false);
      } else {
        // setLoading(false);
        alert('회원정보가 일치하지 않습니다.');
      }
    });
  };

  React.useEffect(() => {
    getToken(setToken);
  }, [])

  console.log('token', token);

  return (
    <LoginContainer component="section">
      <Box className="wrap">
        <img src={Logo} alt="오늘의 주문 로고" style={{ width: '80%' }} />
        <Typography variant="h6">로그인</Typography>
        <Box>
          <TextField
            value={values.email}
            id="outlined-secondary"
            label="아이디"
            variant="outlined"
            className={base.loginInput}
            // onChange={e => setUserEmail(e.target.value)}
            onChange={handleChange('email')}
          />
        </Box>
        <Box>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">비밀번호</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={values.showPassword ? 'text' : 'password'}
              value={values.password}
              className={base.loginInput}
              onChange={handleChange('password')}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>

        <MyButton
          variant="contained"
          className={base.w100}
          onClick={onLoginHandler}
        >
          로그인
        </MyButton>

        <FormControlLabel
          value="end"
          style={{ marginTop: 20 }}
          control={<Checkbox color="primary" />}
          checked={values.isAutoLogin ? true : false}
          label="자동로그인"
          labelPlacement="end"
          onClick={handleClickAutoLogin}
        />
      </Box>
    </LoginContainer>

  )
}
