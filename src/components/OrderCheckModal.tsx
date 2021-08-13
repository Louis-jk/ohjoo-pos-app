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

// Local Component
import Api from '../Api';
import { theme, MainBox, baseStyles, ModalCancelButton, ModalConfirmButton } from '../styles/base';
import orderAction from '../redux/actions';

interface IProps {
  isOpen: boolean;
  od_id: string;
  od_type: string;
  handleClose: () => void;
}

export default function OrderCheckModal(props: IProps) {

  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);
  const history = useHistory();
  const base = baseStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false); // 신규 주문 -> 접수(배달/포장 시간 입력 모달)
  const [deliveryTime, setDeliveryTime] = React.useState(''); // 신규 주문 -> 배달시간 입력

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

  // 현재 신규주문 건수 가져오기
  const getNewOrderHandler = () => {

    const param = {
      item_count: 0,
      limit_count: 10,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      od_process_status: '신규주문'
    };
    Api.send('store_order_list', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        dispatch(dispatch(orderAction.updateNewOrder(JSON.stringify(arrItems))));
        getCheckOrderHandler();
      } else {
        dispatch(dispatch(orderAction.updateNewOrder(null)));
        getCheckOrderHandler();
      }
    });
  }

  // 현재 접수완료 주문 가져오기
  const getCheckOrderHandler = () => {

    const param = {
      item_count: 0,
      limit_count: 10,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      od_process_status: '접수완료'
    };
    Api.send('store_order_list', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        console.log("접수완료 success?", arrItems);
        dispatch(dispatch(orderAction.updateCheckOrder(JSON.stringify(arrItems))));
      } else {
        console.log("접수완료 faild?", arrItems);
        dispatch(dispatch(orderAction.updateCheckOrder(null)));
      }
    });
  }

  // 신규주문 접수하기 (신규주문 상태 -> 접수완료 상태)
  const checkOrderHandler = () => {

    if (deliveryTime === '') {
      if (props.od_type === '포장') {
        setToastState({ msg: '포장 완료 예상시간을 입력해주세요.', severity: 'error' });
      } else {
        setToastState({ msg: '배달 예상 소요시간을 입력해주세요.', severity: 'error' });
      }
      handleOpenAlert();
    } else {
      let param = {
        od_id: props.od_id,
        jumju_id: mt_id,
        jumju_code: mt_jumju_code,
        od_process_status: '접수완료',
        delivery_time: deliveryTime,
        visit_time: deliveryTime
      };

      Api.send('store_order_status_update', param, (args: any) => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;
        if (resultItem.result === 'Y') {
          setToastState({ msg: '주문을 접수하였습니다.', severity: 'success' });
          handleOpenAlert();
          props.handleClose();
          getNewOrderHandler();
          setTimeout(() => {
            history.push('/order_new');
          }, 700);
        } else {
          setToastState({ msg: '주문을 접수하는데 문제가 생겼습니다.', severity: 'error' });
          handleOpenAlert();
          props.handleClose();
          getNewOrderHandler();
        }
      });
    }
  };

  return (
    <>
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
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={base.modal}
        open={props.isOpen}
        // onClose={props.handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.isOpen}>
          <Box className={clsx(base.modalInner, base.colCenter)}>
            <Typography id="transition-modal-title" component="h5" variant="h5" style={{ fontWeight: 'bold', marginBottom: 10, color: theme.palette.primary.main }}>{`${props.od_type === '포장' ? '포장' : '배달'} 예상시간 등록`}</Typography>
            <Typography id="transition-modal-description">{`${props.od_type === '포장' ? '포장' : '배달'} 예상시간을 입력해주세요.`}</Typography>
            <TextField
              value={deliveryTime}
              style={{ width: 200, margin: 20 }}
              id="outlined-basic"
              label={`예상 ${props.od_type === '포장' ? '포장' : '배달'}시간`}
              variant="outlined"
              required
              InputProps={{
                endAdornment: <InputAdornment position="end">분</InputAdornment>,
              }}
              onChange={e => setDeliveryTime(e.target.value as string)}
            />
            <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
              <ModalConfirmButton variant="contained" color="primary" style={{ boxShadow: 'none' }} onClick={checkOrderHandler}>보내기</ModalConfirmButton>
              <ModalCancelButton variant="outlined" onClick={props.handleClose}>취소</ModalCancelButton>
            </ButtonGroup>
          </Box>
        </Fade>
      </Modal>
    </>
  )

}