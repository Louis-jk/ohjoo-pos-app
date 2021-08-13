import React from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  ButtonGroup,
  Button,
  Divider
} from '@material-ui/core';
import OrderCheckModal from './OrderCheckModal'; // 신규주문 주문 접수 모달
import OrderRejectModal from './OrderRejectModal'; // 신규주문 주문 거부 모달
import OrderDeliveryModal from './OrderDeliveryModal'; // 접수완료 주문 배달처리 모달
import OrderCancelModal from './OrderCancelModal'; // 접수완료 주문 취소 모달
import { theme } from '../styles/base';

interface orderData {
  [key: string]: string;
}

type OrderType = 'new' | 'check' | 'delivery' | 'done'

interface OrderProps {
  orders: orderData[];
  type: OrderType;
}

export default function OrderCard(props: OrderProps) {

  const history = useHistory();
  const { orders, type } = props;
  const params = useParams();

  const [odId, setOdId] = React.useState('');
  const [odType, setOdType] = React.useState('');

  // 신규주문 상태 -> 접수(배달/포장 시간 입력) 모달 핸들러
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const checkOrderHandler = (id: string, type: string) => {
    setOdId(id);
    setOdType(type);
    handleOpen();
  }

  // 접수완료 상태 -> 배달중 모달 핸들러
  const [deliveryOpen, setDeliveryOpen] = React.useState(false);
  const handleDeliveryOpen = () => {
    setDeliveryOpen(true);
  };

  const handleDeliveryClose = () => {
    setDeliveryOpen(false);
  };
  const deliveryOrderHandler = (id: string) => {
    setOdId(id);
    handleDeliveryOpen();
  }

  // 신규주문 -> 주문 거부 모달 핸들러
  const [rejectOopen, setRejectOpen] = React.useState(false);
  const handleRejectOpen = () => {
    setRejectOpen(true);
  };

  const handleRejectClose = () => {
    setRejectOpen(false);
  };
  const rejectOrderHandler = (id: string) => {
    setOdId(id);
    handleRejectOpen();
  }

  // 접수완료 상태 -> 주문 취소 모달 핸들러
  const [cancelModalOpen, setCancelModalOpen] = React.useState(false);
  const cancelModalOpenHandler = () => {
    setCancelModalOpen(true);
  };

  const cancelModalCloseHandler = () => {
    setCancelModalOpen(false);
  };

  const checkCancelModalHandler = (id: string) => {
    setOdId(id);
    cancelModalOpenHandler();
  }

  const renderList = (): JSX.Element[] => {
    return orders.map((order, index) =>
      <Grid xs={12} key={order.od_id + index} border={1} borderColor="#ececec" m={1} >
        {/* <Link to={`/details/${order.od_id}`}> */}
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" py={1} px={2} style={{ background: theme.palette.primary.light }}>
          <Typography style={{ margin: 0, fontWeight: 'bold' }}>{order.mb_company}</Typography>
          <Typography style={{ margin: 0 }}>{order.od_time}</Typography>
        </Box>
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" py={1} px={2}>
          <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center" px={1}>
            <img src={order.store_logo} style={{ width: 100, height: 100 }} alt="오늘의 주문 로고" />
            <Box>
              <Box display="flex" flexDirection="row" mb={1}>
                <Typography style={{ fontSize: 15, margin: 0, marginRight: 5 }}>{order.od_settle_case}</Typography>
                <Typography style={{ fontSize: 15, margin: 0 }}>{order.od_receipt_price}원</Typography>
              </Box>
              <Typography style={{ margin: 0 }}>{order.od_addr1 + order.od_addr2}</Typography>
              <Typography style={{ margin: 0 }}>{order.od_addr3}</Typography>
            </Box>
          </Box>
          <Divider />

          <ButtonGroup variant="outlined" color="primary" style={{ color: theme.palette.primary.contrastText, borderColor: theme.palette.primary.light }} aria-label="text primary button group">
            <Button style={{ color: theme.palette.primary.contrastText, minWidth: 120, height: 75 }} onClick={() => history.push(`/orderdetail/${order.od_id}`)}>상세보기</Button>
            {
              type === 'new' ?
                <Button style={{ color: theme.palette.primary.contrastText, minWidth: 120, height: 75 }} onClick={() => checkOrderHandler(order.od_id, order.od_type)}>접수처리</Button>
                : type === 'check' ?
                  <Button style={{ color: theme.palette.primary.contrastText, minWidth: 120, height: 75 }} onClick={() => deliveryOrderHandler(order.od_id)}>배달처리</Button>
                  : null
            }
            {
              type === 'new' ?
                <Button style={{ color: theme.palette.primary.contrastText, minWidth: 120, height: 75 }} onClick={() => rejectOrderHandler(order.od_id)}>거부처리</Button>
                : type === 'check' ?
                  <Button style={{ color: theme.palette.primary.contrastText, minWidth: 120, height: 75 }} onClick={() => checkCancelModalHandler(order.od_id)}>취소처리</Button>
                  : null}
          </ButtonGroup>

        </Box>
        {/* </Link> */}
      </Grid >
    )
  }

  return (
    orders.length > 0 ?
      <>
        <OrderCheckModal isOpen={open} od_id={odId} od_type={odType} handleClose={handleClose} />
        <OrderRejectModal isOpen={rejectOopen} od_id={odId} handleClose={handleRejectClose} />
        <OrderDeliveryModal isOpen={deliveryOpen} od_id={odId} handleClose={handleDeliveryClose} />
        <OrderCancelModal isOpen={cancelModalOpen} od_id={odId} handleClose={cancelModalCloseHandler} />
        <Grid container spacing={3}>
          {renderList()}
        </Grid>
      </>
      :
      <Box style={{ display: 'flex', flex: 1, height: '80vh', justifyContent: 'center', alignItems: 'center' }}>
        <Typography>{type === 'new' ? '신규 ' : type === 'check' ? '접수완료된 ' : type === 'delivery' ? '배달중인 ' : type === 'done' ? '배달완료된 ' : null}주문이 없습니다.</Typography>
      </Box>
  )
}