import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

// Material UI Components
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

// Local Component
import Api from '../Api';
import loginAction from '../redux/actions';
import { baseStyles, theme } from '../styles/base';

export default function Check() {

  const base = baseStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [token, setToken] = React.useState('');

  const onLoginHandler = (id: string, pwd: string) => {
    // setLoading(true);

    const param = {
      mt_id: id,
      mt_pwd: pwd,
      mt_app_token: token
    };

    Api.send('store_login', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        dispatch(loginAction.updateLogin(JSON.stringify(arrItems)));
        history.replace('/main');
        // setLoading(false);
      } else {
        // setLoading(false);
        alert('회원정보가 일치하지 않습니다.');
      }
    });
  };

  // 토큰 정보 가져오기
  const getStorageToken = async () => {
    try {
      const jsonValue = await localStorage.getItem('ohjooStoreToken');
      console.log('유저 토큰 ?', jsonValue);
      if (jsonValue !== null) {
        const UserToken = JSON.parse(jsonValue);
        const result = UserToken.token;
        setToken(result);
      }
    } catch (e) {
      console.log('토큰을 가져오지 못했습니다.');
      history.push('/login');
    }
  }

  // 유저 정보 가져오기(자동로그인?)
  const getStorage = async () => {
    try {
      const jsonValue = await localStorage.getItem('userAccount');
      if (jsonValue !== null) {
        console.log('유저 정보 가져오기 :: ', JSON.parse(jsonValue));

        const UserInfo = JSON.parse(jsonValue);
        const userId = UserInfo.userId;
        const userPwd = UserInfo.userPwd;

        console.log('userId ::', userId);
        console.log('userPwd ::', userPwd);
        onLoginHandler(userId, userPwd);
      } else {
        history.push('/login');
      }
    } catch (err) {
      console.log('로컬 스토리지에 저장된 회원 정보 없음');
      history.push('/login');
    }
  }

  React.useEffect(() => {
    getStorageToken();
    getStorage();
  }, [])

  console.log("토큰은?????", token);

  return (
    <Box className={base.loadingWrap} style={{ flexDirection: 'column', backgroundColor: theme.palette.primary.main }}>
      <CircularProgress disableShrink color="secondary" style={{ width: 50, height: 50, marginBottom: 20 }} />
      <Typography style={{ color: theme.palette.primary.contrastText }}>체크중</Typography>
    </Box>
  )
}