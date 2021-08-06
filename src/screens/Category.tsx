import * as React from 'react';
import { useSelector } from 'react-redux';

// Material UI Components
import { styled } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import Switch, { SwitchProps } from '@material-ui/core/Switch';
import Alert from '@material-ui/core/Alert';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

// Material icons


// Local Component
import Header from '../components/Header';
import Api from '../Api';
import { theme, MainBox, baseStyles, ModalCancelButton, ModalConfirmButton } from '../styles/base';

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&:before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&:after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));

interface State {
  amount: string;
  password: string;
  weight: string;
  weightRange: string;
  showPassword: boolean;
}

interface ICategory {
  ca_id: string;
  ca_code: string;
  ca_img: string;
  ca_name: string;
  ca_use: string;
}

export default function SetCategory(props: any) {

  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);
  const base = baseStyles();
  const [lists, setLists] = React.useState<ICategory[]>([
    {
      ca_id: '',
      ca_code: '',
      ca_img: '',
      ca_name: '',
      ca_use: ''
    }
  ]);
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

  // 등록된 팁 정보 가져오기
  const getCategoryHandler = () => {
    setLoading(true);
    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code
    };

    Api.send('store_item_category', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        setLists(arrItems);
        setLoading(false);
      } else {
        setLists([]);
        setLoading(false);
      }
    });
  };

  React.useEffect(() => {
    getCategoryHandler();
  }, [mt_id, mt_jumju_code]);


  return (
    <Box component="div">
      <Header type="category" />
      <div className={base.alertStyle}>
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

      {isLoading ?
        <div className={base.loadingWrap}>
          <CircularProgress disableShrink color="primary" style={{ width: 50, height: 50 }} />
        </div>
        :
        <MainBox component='main' sx={{ flexGrow: 1, p: 3 }}>
          <Grid container spacing={3}>
            {lists && lists.length > 0 && lists.map((list, index) =>
              <Grid item xs={6} sm={6} md={4} key={list.ca_id} style={{ position: 'relative' }}>
                <div className={base.txtRoot}>
                  <TextField
                    value={list.ca_name}
                    className={base.textField}
                    fullWidth
                    id="outlined-basic"
                    label="카테고리명"
                    variant="outlined"
                    required
                    onChange={e => setLists(lists => {
                      const result = [...lists];
                      result[index].ca_name = e.target.value as string;
                      return result;
                    })}
                    // onMouseLeave={() => alert('end?')}
                    InputProps={{
                      // endAdornment: <InputAdornment position="end">원 이상</InputAdornment>,
                      endAdornment:
                        <>
                          <FormControlLabel
                            control={<Android12Switch defaultChecked />}
                            label=""
                          />
                          {/* <Button style={{ minWidth: 45 }} disabled>수정</Button> */}
                        </>
                    }}
                  />
                </div>
              </Grid>
            )}
          </Grid>
          {lists.length === 0 || lists === null ?
            <Box style={{ display: 'flex', flex: 1, height: '80vh', justifyContent: 'center', alignItems: 'center' }}>
              <Typography style={{ fontSize: 15 }}>등록된 카테고리가 없습니다.</Typography>
            </Box>
            : null}
        </MainBox>
      }
    </Box >
  );
}