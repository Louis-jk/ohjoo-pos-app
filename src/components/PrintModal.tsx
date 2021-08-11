import * as React from "react";
import { useSelector } from "react-redux";
import { faPrint, faShoePrints } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Api from "../Api";
import { makeStyles } from "@material-ui/styles";
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { theme, baseStyles } from '../styles/base';
import { Divider, IconButton } from "@material-ui/core";
import { useReactToPrint } from 'react-to-print';

import PrintIcon from '@material-ui/icons/Print';
import FileDownloadIcon from '@material-ui/icons/FileDownload';
import CloseIcon from '@material-ui/icons/Close';

import OrderPrint from './ComponentToPrint';


const PrintModal = (props: any) => {
  const { mt_store } = useSelector((state: any) => state.login);
  const { order, product, store } = useSelector((state: any) => state.orderDetail);

  const base = baseStyles();

  // 프린트 출력 부분
  const componentRef = React.useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  return mt_store && order && product && store && (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={base.modal}
        open={props.isOpen}
        // onClose={props.isClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.isOpen}>
          <Box display="block" width="80mm" height="160mm" overflow="auto" zIndex={99999} px={3} pb={3} pt={1} style={{ backgroundColor: '#fff' }}>
            <Box display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center">
              {/* <FontAwesomeIcon icon={faPrint} size="1x" /> */}
              <IconButton
                onClick={handlePrint}
              >
                <PrintIcon />
              </IconButton>
              <IconButton
                onClick={props.isClose}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography textAlign="center" fontWeight="bold" component="h5" variant="h5" mb={2}>오늘의 주문</Typography>
            <Divider />
            <Box my={2}>
              <Typography mb={0.5} fontSize="12pt" fontWeight="bold" marginBottom={1.5}>주문정보</Typography>
              <Box display="flex" flexDirection="row" mb={0.5}>
                <Typography fontSize="11pt" lineHeight={1.2} flex={3}>주문매장 : </Typography>
                <Typography fontSize="11pt" lineHeight={1.2} flex={10} textAlign="right">{store.mb_company}</Typography>
              </Box>
              <Box display="flex" flexDirection="row" mb={0.5}>
                <Typography fontSize="11pt" lineHeight={1.2} flex={3}>주문시간 : </Typography>
                <Typography fontSize="11pt" lineHeight={1.2} flex={10} textAlign="right">{order.od_time}</Typography>
              </Box>
              <Box display="flex" flexDirection="row" mb={0.5}>
                <Typography fontSize="11pt" lineHeight={1.2} flex={3}>주문방법 : </Typography>
                <Typography fontSize="11pt" lineHeight={1.2} flex={10} textAlign="right">{order.od_type}</Typography>
              </Box>
            </Box>
            <Divider />
            <Box my={2}>
              <Typography mb={0.5} fontSize="12pt" fontWeight="bold" marginBottom={1.5}>주문메뉴</Typography>
              {product.map((item: any, index: number) => (
                <Typography key={index} fontSize="11pt" lineHeight={1.2}>메뉴 : {item.it_name} / 옵션 - {item.ct_option}</Typography>
              ))}
            </Box>
            <Divider />
            <Box my={2}>
              <Typography mb={0.5} fontSize="12pt" fontWeight="bold" marginBottom={1.5}>배달정보</Typography>
              <Box display="flex" flexDirection="row" mb={0.5}>
                <Typography fontSize="11pt" lineHeight={1.2} flex={3}>배달주소 : </Typography>
                <Typography fontSize="11pt" lineHeight={1.2} flex={10} textAlign="right">{order.order_addr1} {order.order_addr3}</Typography>
              </Box>
              <Box display="flex" flexDirection="row" mb={0.5}>
                <Typography fontSize="11pt" lineHeight={1.2} flex={3}>전화번호 : </Typography>
                <Typography fontSize="11pt" lineHeight={1.2} flex={10} textAlign="right">{order.order_hp}</Typography>
              </Box>
            </Box>
            <Divider />
            <Box my={2}>
              <Typography mb={0.5} fontSize="12pt" fontWeight="bold">요청사항</Typography>
              <Box display="flex" flexDirection="row" mb={0.5}>
                <Typography fontSize="11pt" lineHeight={1.2} flex={3}>사장님께 : </Typography>
                <Typography fontSize="11pt" lineHeight={1.2} flex={10} textAlign="right">{order.order_seller ? order.order_seller : "요청사항이 없습니다."}</Typography>
              </Box>
              <Box display="flex" flexDirection="row">
                <Typography fontSize="11pt" lineHeight={1.2} flex={3}>기사님께 : </Typography>
                <Typography fontSize="11pt" lineHeight={1.2} flex={10} textAlign="right">{order.order_officer ? order.order_officer : "요청사항이 없습니다."}</Typography>
              </Box>
            </Box>
            <Divider />
            <Box my={2}>
              <Typography mb={0.5} fontSize="12pt" fontWeight="bold">결제정보</Typography>
              <Box display="flex" flexDirection="row" mb={0.5}>
                <Typography fontSize="11pt" lineHeight={1.2} flex={3}>총 주문금액 : </Typography>
                <Typography fontSize="11pt" lineHeight={1.2} flex={8} textAlign="right">{Api.comma(order.odder_cart_price)} 원</Typography>
              </Box>
              <Box display="flex" flexDirection="row" mb={0.5}>
                <Typography fontSize="11pt" lineHeight={1.2} flex={3}>배달팁 : </Typography>
                <Typography fontSize="11pt" lineHeight={1.2} flex={8} textAlign="right">{Api.comma(order.order_cost)} 원</Typography>
              </Box>
              <Box display="flex" flexDirection="row" mb={0.5}>
                <Typography fontSize="11pt" lineHeight={1.2} flex={3}>포인트 : </Typography>
                <Typography fontSize="11pt" lineHeight={1.2} flex={8} textAlign="right">{Api.comma(order.order_point)} P</Typography>
              </Box>
              <Box display="flex" flexDirection="row" mb={0.5}>
                <Typography fontSize="11pt" lineHeight={1.2} flex={3}>쿠폰할인 : </Typography>
                <Typography fontSize="11pt" lineHeight={1.2} flex={8} textAlign="right">{Api.comma(order.order_coupon)} 원</Typography>
              </Box>
              <Box display="flex" flexDirection="row" mb={2}>
                <Typography fontSize="11pt" lineHeight={1.2} flex={3}>결제방법 : </Typography>
                <Typography fontSize="11pt" lineHeight={1.2} flex={8} textAlign="right">{order.od_settle_case}</Typography>
              </Box>
              <Divider />
              <Box display="flex" flexDirection="row" mt={2} mb={1}>
                <Typography fontSize="12pt" fontWeight="bold" lineHeight={1.2} flex={4}>총 결제금액 : </Typography>
                <Typography fontSize="12pt" fontWeight="bold" lineHeight={1.2} flex={8} textAlign="right">{Api.comma(order.order_sumprice)} 원</Typography>
              </Box>
            </Box>
            <Divider />
          </Box>
        </Fade>
      </Modal>
      <Box style={{ display: 'none' }}>
        <OrderPrint ref={componentRef} />
      </Box>
    </>
  )
};

export default PrintModal;
