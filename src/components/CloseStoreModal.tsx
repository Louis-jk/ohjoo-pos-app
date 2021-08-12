import * as React from 'react';
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';

// Material UI Components
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import { styled } from '@material-ui/core/styles';
import Switch, { SwitchProps } from '@material-ui/core/Switch';

// Local Component
import { theme, baseStyles } from '../styles/base';
import storeAction from '../redux/actions';

interface IProps {
  isOpen: boolean;
  isClose: () => void;
}

interface Object {
  [key: string]: string;
}

export default function CloseStoreModal(props: IProps) {

  const base = baseStyles();
  const dispatch = useDispatch();
  const { allStore, closedStore } = useSelector((state: any) => state.store);
  const [closeId, setCloseId] = React.useState<string[]>([]); // 매장 영업중지 테스트 상태관리

  const setCloseStoreHandler = (id: string) => {

    const filtered = closeId.find(closeId => closeId === id);

    if (filtered) {
      const removeObj = closeId.filter(closeId => closeId !== id);
      setCloseId(removeObj);
      dispatch(storeAction.closedStore(removeObj));
    } else {
      let result = closeId.concat(id);
      setCloseId(result);
      dispatch(storeAction.closedStore(result));
    }
  }

  // console.log("closeId", closeId);

  const Android12Switch = styled(Switch)(({ theme }) => ({
    padding: 8,
    '& .MuiSwitch-track': {
      backgroundColor: '#b3b3b3',
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

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={base.modal}
      open={props.isOpen}
      onClose={props.isClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={props.isOpen}>
        <Box className={clsx(base.modalInner, base.colCenter)} p={5}>
          <Typography id="transition-modal-title" component="h5" variant="h5" style={{ fontWeight: 'bold', marginBottom: 10, color: theme.palette.primary.main }}>영업 일시정지</Typography>
          <Typography id="transition-modal-description">정지하고자 하는 매장은 스위치를 꺼주세요.</Typography>

          <Box style={{ height: 1, width: '100%', backgroundColor: '#d5d5d5' }} my={2} />

          {allStore && allStore.length > 0 ? allStore.map((store: Object, index: number) => (

            <Box key={index} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" width="100%" my={1}>
              <Box flexShrink={1} style={{ minWidth: 200 }}>
                <Typography textAlign="left">{store.mt_store}</Typography>
              </Box>
              <Box flexShrink={1} textAlign="left" style={{ minWidth: 70 }}>
                <Typography
                  component="span"
                  fontSize={12}
                  px={1}
                  py={0.5}
                  style={{
                    borderRadius: 5,
                    backgroundColor: closedStore.find((id: string) => id === store.id) ? '#F8485E' : '#9FE6A0',
                    color: closedStore.find((id: string) => id === store.id) ? '#fff' : '#564A4A',
                    transition: '.2s ease-in',
                  }}
                >
                  {closedStore.find((id: string) => id === store.id) ? '정지중' : '영업중'}
                </Typography>
              </Box>
              <Box flexShrink={1}>
                <Android12Switch color="primary" onChange={() => setCloseStoreHandler(store.id)} checked={closedStore.find((id: string) => id === store.id) ? false : true} />
              </Box>
            </Box>
          ))
            : <Typography textAlign="left">등록된 매장이 없습니다.</Typography>
          }
        </Box>
      </Fade>
    </Modal>
  )
}