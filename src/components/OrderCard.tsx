import React from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  ButtonGroup,
  Button
} from '@material-ui/core';


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

  const renderList = (): JSX.Element[] => {
    return orders.map((order, index) =>
      <Grid item xs={12} component="li" key={order.od_id}>
        {/* <Link to={`/details/${order.od_id}`}> */}
        <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: '#e5e5e5', paddingTop: 5, paddingBottom: 5, paddingLeft: 15, paddingRight: 15 }}>
          <Typography style={{ margin: 0, fontWeight: 'bold' }}>{order.mb_company}</Typography>
          <Typography style={{ margin: 0 }}>{order.od_time}</Typography>
        </Box>


        <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: '#fff', paddingTop: 5, paddingBottom: 5, paddingLeft: 15, paddingRight: 15 }}>
          <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', background: '#fff' }}>
            <img src={order.store_logo} style={{ width: 100, height: 100 }} alt="오늘의 주문 로고" />
            <Box>
              <Box style={{ display: 'flex', flexDirection: 'row', marginBottom: 7 }}>
                <Typography style={{ color: '#666', fontSize: 14, margin: 0, marginRight: 5 }}>{order.od_settle_case}</Typography>
                <Typography style={{ color: '#666', fontSize: 14, margin: 0 }}>{order.od_receipt_price}원</Typography>
              </Box>
              <Typography style={{ margin: 0 }}>{order.od_addr1 + order.od_addr2}</Typography>
              <Typography style={{ margin: 0 }}>{order.od_addr3}</Typography>
            </Box>
          </Box>
          <Box style={{ display: 'block', width: 1, height: 100, background: '#e5e5e5', marginLeft: 20, marginRight: 20 }}></Box>

          <ButtonGroup variant="outlined" color="primary" style={{ backgroundColor: '#e5e5e5', borderColor: '#e5e5e5' }} aria-label="text primary button group">
            <Button style={{ minWidth: 120, height: 75 }} onClick={() => history.push(`/details/${order.od_id}`)}>상세보기</Button>
            {
              type === 'new' ?
                <Button style={{ minWidth: 120, height: 75 }} /* onClick={() => checkOrderHandler(order.od_id, order.od_type)} */>접수</Button>
                : type === 'check' ?
                  <Button style={{ minWidth: 120, height: 75 }}>배달</Button>
                  : null
            }
            {
              type === 'new' ?
                <Button style={{ minWidth: 120, height: 75 }} /* onClick={() => rejectOrderHandler(order.od_id)} */>거부</Button>
                : type === 'check' ?
                  <Button style={{ minWidth: 120, height: 75 }}>취소</Button>
                  : null}
          </ButtonGroup>

        </Box>
        {/* </Link> */}
      </Grid>
    )
  }

  return (
    orders.length > 0 ?
      <>
        {/* <OrderCheckModal isOpen={open} od_id={odId} od_type={odType} handleClose={handleClose} />
      <OrderRejectModal isOpen={rejectOopen} od_id={odId} handleClose={handleRejectClose} /> */}
        <Grid component="ul" container spacing={3}>
          {renderList()}
        </Grid>
      </>
      :
      <Box style={{ display: 'flex', flex: 1, height: '80vh', justifyContent: 'center', alignItems: 'center' }}>
        <Typography>{type === 'new' ? '신규 ' : type === 'check' ? '접수완료된 ' : type === 'delivery' ? '배달중인 ' : type === 'done' ? '배달완료된 ' : null}주문이 없습니다.</Typography>
      </Box>
  )
}