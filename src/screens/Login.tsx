import * as React from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

// Material UI Components
import { Box, Typography, TextField, FormControlLabel, Checkbox, IconButton, Button } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

// Material UI Icons
import CloseIcon from '@material-ui/icons/Close';

// Local Component
import Logo from '../assets/images/logo_bk.png';
import Api from '../Api';
import loginAction from '../redux/actions';
import { getToken, onMessageListener } from '../firebaseConfig';
import { LoginContainer, baseStyles, LoginButton } from '../styles/base';
import appRuntime from '../appRuntime';

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
    } catch (e) {
      alert(`${e} :: 관리자에게 문의하세요.`);
    }
  }

  //  자동 토큰 저장
  const storeAddToken = async (token: string) => {
    try {
      const jsonValue = JSON.stringify({ token: token });
      await localStorage.setItem('ohjooStoreToken', jsonValue);
    } catch (e) {
      alert(`${e} :: 관리자에게 문의하세요.`);
    }
  };

  const onLoginHandler = () => {
    // setLoading(true);

    const param = {
      mt_id: values.email,
      mt_pwd: values.password,
      mt_app_token: token
    };

    console.log("로그인 params", param);

    Api.send('store_login', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        if (values.isAutoLogin) {
          storeData();
        }
        storeAddToken(token);
        dispatch(loginAction.updateLogin(JSON.stringify(arrItems)));
        history.replace('/main');
        setValues({
          ...values,
          email: '',
          password: '',
        });
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

  // 윈도우 닫기 핸들러
  const windowCloseHandler = () => {
    appRuntime.send('window-close', 'close');
  }

  return (
    <>
      <Box style={{ position: 'absolute', top: 0, right: 0 }}>
        <IconButton onClick={windowCloseHandler}>
          <CloseIcon />
        </IconButton>
      </Box>

      <LoginContainer component="section">
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" p={5} style={{ backgroundColor: '#fff', borderRadius: 20, boxShadow: '0 0 15px 2px rgba(0,0,0,0.17)' }}>
          <img src={Logo} alt="오늘의 주문 로고" style={{ width: 150, marginBottom: 30 }} />
          {/* <Typography variant="h6">로그인</Typography> */}
          <Box mb={2} style={{ minWidth: 300 }}>
            <TextField
              value={values.email}
              label="아이디"
              variant="outlined"
              className={base.loginInput}
              onChange={handleChange('email')}
            />
          </Box>

          <Box mb={2} style={{ minWidth: 300 }}>
            <TextField
              type={values.showPassword ? 'text' : 'password'}
              value={values.password}
              label="패스워드"
              variant="outlined"
              className={base.loginInput}
              onChange={handleChange('password')}
              InputProps={{
                endAdornment: <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              }}
            />
          </Box>

          <LoginButton
            variant="contained"
            className={base.w100}
            onClick={onLoginHandler}
          >
            로그인
          </LoginButton>

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
    </>
  )
}
