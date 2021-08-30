import * as React from "react";
import { useSelector } from "react-redux";
import * as path from 'path';

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
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

import OrderPrint from './ComponentToPrint';

import { PosPrintData, PosPrintOptions } from "electron-pos-printer";
import appRuntime from '../appRuntime';

type ModalType = 'print' | 'check';

interface PrintProps {
  isOpen: boolean;
  isClose: () => void;
  type: ModalType;
}

const PrintModal = (props: PrintProps) => {
  const { mt_store } = useSelector((state: any) => state.login);
  const { order, product, store } = useSelector((state: any) => state.orderDetail);

  const base = baseStyles();

  // 프린트 출력 부분
  const componentRef = React.useRef(null);

  //　일반적인 웹형식 프린트출력(프린트 선택 dialog 뜸) 
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current
  // });

  const data: PosPrintData[] = [
    {
      type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
      value: "||---",
      style: `text-align:left;`,
      css: { "font-size": "12px" },
    },
    {
      type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
      value: "HEADER",
      style: `text-align:center;`,
      css: { "font-weight": "700", "font-size": "18px" },
    },
    {
      type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
      value:
        "Lorem ipsum<br><br> . , ; : ( ) - + = ! # % \" ' <br><br> ã Ã ç Ç $ & @ ê Ê í Í<br><br> 0 1 2 3 4 5 6 7 8 9 <br>a b c d e f g h i j k l m n o p q r s t u v w x y z<br>A B C D E F G H I J K L M N O P Q R S T U V W X Y Z<br><br><hr><br>elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation \n ullamco \n laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum<br>",

      css: {
        "font-size": "12px",
        "font-family": "sans-serif",
        "text-align": "center",
      },
    },
    {
      type: "barCode", // Do you think the result is ugly? Me too. Try use an image instead...
      value: "HB4587896",
      height: "12",
      width: "1",
      displayValue: true, // Display value below barcode
      fontsize: 8,
    },
    {
      type: "qrCode",
      value: "https://github.com/fssonca",
      height: "80",
      width: "80",
      style: "margin-left:50px",
    },
    {
      type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
      value: "---||",
      style: `text-align:right;`,
      css: { "font-size": "12px" },
    },
  ];

  const options: PosPrintOptions = {
    preview: true, // Preview in window or print
    width: '170px', //  width of content body
    margin: "0 0 0 0", // margin of content body
    copies: 1, // Number of copies to print
    printerName: 'EPSONC3D506 (L6190 Series)', // printerName: string, check it at webContent.getPrinters()
    timeOutPerLine: 6000,
    silent: true,
  };

  // This is printer handler
  const handlePrint = () => {
    // appRuntime.printer(data, options);
    appRuntime.printer('print', data);
  }

  // console.log("props type", props.type);

  return mt_store && order && product && store && (
    <>
      {props.type === 'print' ?
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
            <Box display="flex" flexDirection="column">
              <div className='print_no_area' style={{ zIndex: 99999 }}>
                <Box display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center" style={{ backgroundColor: theme.palette.primary.main }}>
                  {/* <FontAwesomeIcon icon={faPrint} size="1x" /> */}
                  <IconButton
                    onClick={handlePrint}
                  >
                    <PrintIcon color="secondary" />
                  </IconButton>
                  <IconButton
                    onClick={props.isClose}
                  >
                    <CloseRoundedIcon color="secondary" />
                  </IconButton>
                </Box>
                <Divider />
              </div>
              <Box id='printBox' className={base.printModal} style={{ backgroundColor: '#fff' }}>
                <Typography textAlign="center" fontWeight="bold" component="h5" variant="h5" mb={2}>오늘의 주문</Typography>
                <Divider />
                <Box my={2}>
                  <Typography mb={1} fontSize="12pt" fontWeight="bold">주문정보</Typography>
                  <Box display="flex" flexDirection="row" mb={0.5}>
                    <Typography fontSize="10.5pt" lineHeight={1.2} flex={3}>주문매장 : </Typography>
                    <Typography fontSize="10.5pt" lineHeight={1.2} flex={10} textAlign="right">{store.mb_company}</Typography>
                  </Box>
                  <Box display="flex" flexDirection="row" mb={0.5}>
                    <Typography fontSize="10.5pt" lineHeight={1.2} flex={3}>주문시간 : </Typography>
                    <Typography fontSize="10.5pt" lineHeight={1.2} flex={10} textAlign="right">{order.od_time}</Typography>
                  </Box>
                  <Box display="flex" flexDirection="row" mb={0.5}>
                    <Typography fontSize="10.5pt" lineHeight={1.2} flex={3}>주문방법 : </Typography>
                    <Typography fontSize="10.5pt" lineHeight={1.2} flex={10} textAlign="right">{order.od_type}</Typography>
                  </Box>
                </Box>
                <Divider />
                <Box my={2}>
                  <Typography mb={1} fontSize="12pt" fontWeight="bold">주문메뉴</Typography>
                  {product.map((item: any, index: number) => (
                    <Typography key={index} fontSize="10.5pt" lineHeight={1.2}>메뉴 : {item.it_name} / 옵션 - {item.ct_option}</Typography>
                  ))}
                </Box>
                <Divider />
                <Box my={2}>
                  <Typography mb={1} fontSize="12pt" fontWeight="bold">배달정보</Typography>
                  <Box display="flex" flexDirection="row" mb={0.5}>
                    <Typography fontSize="10.5pt" lineHeight={1.2} flex={3}>배달주소 : </Typography>
                    <Typography fontSize="10.5pt" lineHeight={1.2} flex={10} textAlign="right">{order.order_addr1} {order.order_addr3}</Typography>
                  </Box>
                  <Box display="flex" flexDirection="row" mb={0.5}>
                    <Typography fontSize="10.5pt" lineHeight={1.2} flex={3}>전화번호 : </Typography>
                    <Typography fontSize="10.5pt" lineHeight={1.2} flex={10} textAlign="right">{order.order_hp}</Typography>
                  </Box>
                </Box>
                <Divider />
                <Box my={2}>
                  <Typography mb={1} fontSize="12pt" fontWeight="bold">요청사항</Typography>
                  <Box display="flex" flexDirection="row" mb={0.5}>
                    <Typography fontSize="10.5pt" lineHeight={1.2} flex={3}>사장님께 : </Typography>
                    <Typography fontSize="10.5pt" lineHeight={1.2} flex={10} textAlign="right">{order.order_seller ? order.order_seller : "요청사항이 없습니다."}</Typography>
                  </Box>
                  <Box display="flex" flexDirection="row">
                    <Typography fontSize="10.5pt" lineHeight={1.2} flex={3}>기사님께 : </Typography>
                    <Typography fontSize="10.5pt" lineHeight={1.2} flex={10} textAlign="right">{order.order_officer ? order.order_officer : "요청사항이 없습니다."}</Typography>
                  </Box>
                </Box>
                <Divider />
                <Box my={2}>
                  <Typography mb={1} fontSize="12pt" fontWeight="bold">결제정보</Typography>
                  <Box display="flex" flexDirection="row" mb={0.5}>
                    <Typography fontSize="10.5pt" lineHeight={1.2} flex={4}>총 주문금액 : </Typography>
                    <Typography fontSize="10.5pt" lineHeight={1.2} flex={7} textAlign="right">{Api.comma(order.odder_cart_price)} 원</Typography>
                  </Box>
                  <Box display="flex" flexDirection="row" mb={0.5}>
                    <Typography fontSize="10.5pt" lineHeight={1.2} flex={4}>배달팁 : </Typography>
                    <Typography fontSize="10.5pt" lineHeight={1.2} flex={7} textAlign="right">{Api.comma(order.order_cost)} 원</Typography>
                  </Box>
                  <Box display="flex" flexDirection="row" mb={0.5}>
                    <Typography fontSize="10.5pt" lineHeight={1.2} flex={4}>포인트 : </Typography>
                    <Typography fontSize="10.5pt" lineHeight={1.2} flex={7} textAlign="right">{Api.comma(order.order_point)} P</Typography>
                  </Box>
                  <Box display="flex" flexDirection="row" mb={0.5}>
                    <Typography fontSize="10.5pt" lineHeight={1.2} flex={4}>쿠폰할인 : </Typography>
                    <Typography fontSize="10.5pt" lineHeight={1.2} flex={7} textAlign="right">{Api.comma(order.order_coupon)} 원</Typography>
                  </Box>
                  <Box display="flex" flexDirection="row" mb={2}>
                    <Typography fontSize="10.5pt" lineHeight={1.2} flex={4}>결제방법 : </Typography>
                    <Typography fontSize="10.5pt" lineHeight={1.2} flex={7} textAlign="right">{order.od_settle_case}</Typography>
                  </Box>
                  <Divider />
                  <Box display="flex" flexDirection="row" mt={2} mb={1}>
                    <Typography fontSize="12pt" fontWeight="bold" lineHeight={1.2} flex={4}>총 결제금액 : </Typography>
                    <Typography fontSize="12pt" fontWeight="bold" lineHeight={1.2} flex={7} textAlign="right">{Api.comma(order.order_sumprice)} 원</Typography>
                  </Box>
                </Box>
                <Divider />
              </Box>
            </Box>
          </Fade>
        </Modal>
        : props.type === 'check' ?
          <Modal
            // style={{ visibility: 'hidden' }}
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
              <Box id="check" display="flex" flexDirection="column">
                <Box display="block" width="80mm" height="160mm" overflow="auto" zIndex={99999} px={3} py={3} style={{ backgroundColor: '#fff' }}>
                  <Typography textAlign="center" fontWeight="bold" component="h5" variant="h5" mb={2}>오늘의 주문</Typography>
                  <Divider />
                  <Box my={2}>
                    <Typography mb={1} fontSize="12pt" fontWeight="bold">주문정보</Typography>
                    <Box display="flex" flexDirection="row" mb={0.5}>
                      <Typography fontSize="10.5pt" lineHeight={1.2} flex={3}>주문매장 : </Typography>
                      <Typography fontSize="10.5pt" lineHeight={1.2} flex={10} textAlign="right">{store.mb_company}</Typography>
                    </Box>
                    <Box display="flex" flexDirection="row" mb={0.5}>
                      <Typography fontSize="10.5pt" lineHeight={1.2} flex={3}>주문시간 : </Typography>
                      <Typography fontSize="10.5pt" lineHeight={1.2} flex={10} textAlign="right">{order.od_time}</Typography>
                    </Box>
                    <Box display="flex" flexDirection="row" mb={0.5}>
                      <Typography fontSize="10.5pt" lineHeight={1.2} flex={3}>주문방법 : </Typography>
                      <Typography fontSize="10.5pt" lineHeight={1.2} flex={10} textAlign="right">{order.od_type}</Typography>
                    </Box>
                  </Box>
                  <Divider />
                  <Box my={2}>
                    <Typography mb={1} fontSize="12pt" fontWeight="bold">주문메뉴</Typography>
                    {product.map((item: any, index: number) => (
                      <Typography key={index} fontSize="10.5pt" lineHeight={1.2}>메뉴 : {item.it_name} / 옵션 - {item.ct_option}</Typography>
                    ))}
                  </Box>
                  <Divider />
                  <Box my={2}>
                    <Typography mb={1} fontSize="12pt" fontWeight="bold">배달정보</Typography>
                    <Box display="flex" flexDirection="row" mb={0.5}>
                      <Typography fontSize="10.5pt" lineHeight={1.2} flex={3}>배달주소 : </Typography>
                      <Typography fontSize="10.5pt" lineHeight={1.2} flex={10} textAlign="right">{order.order_addr1} {order.order_addr3}</Typography>
                    </Box>
                    <Box display="flex" flexDirection="row" mb={0.5}>
                      <Typography fontSize="10.5pt" lineHeight={1.2} flex={3}>전화번호 : </Typography>
                      <Typography fontSize="10.5pt" lineHeight={1.2} flex={10} textAlign="right">{order.order_hp}</Typography>
                    </Box>
                  </Box>
                  <Divider />
                  <Box my={2}>
                    <Typography mb={1} fontSize="12pt" fontWeight="bold">요청사항</Typography>
                    <Box display="flex" flexDirection="row" mb={0.5}>
                      <Typography fontSize="10.5pt" lineHeight={1.2} flex={3}>사장님께 : </Typography>
                      <Typography fontSize="10.5pt" lineHeight={1.2} flex={10} textAlign="right">{order.order_seller ? order.order_seller : "요청사항이 없습니다."}</Typography>
                    </Box>
                    <Box display="flex" flexDirection="row">
                      <Typography fontSize="10.5pt" lineHeight={1.2} flex={3}>기사님께 : </Typography>
                      <Typography fontSize="10.5pt" lineHeight={1.2} flex={10} textAlign="right">{order.order_officer ? order.order_officer : "요청사항이 없습니다."}</Typography>
                    </Box>
                  </Box>
                  <Divider />
                  <Box my={2}>
                    <Typography mb={1} fontSize="12pt" fontWeight="bold">결제정보</Typography>
                    <Box display="flex" flexDirection="row" mb={0.5}>
                      <Typography fontSize="10.5pt" lineHeight={1.2} flex={4}>총 주문금액 : </Typography>
                      <Typography fontSize="10.5pt" lineHeight={1.2} flex={7} textAlign="right">{Api.comma(order.odder_cart_price)} 원</Typography>
                    </Box>
                    <Box display="flex" flexDirection="row" mb={0.5}>
                      <Typography fontSize="10.5pt" lineHeight={1.2} flex={4}>배달팁 : </Typography>
                      <Typography fontSize="10.5pt" lineHeight={1.2} flex={7} textAlign="right">{Api.comma(order.order_cost)} 원</Typography>
                    </Box>
                    <Box display="flex" flexDirection="row" mb={0.5}>
                      <Typography fontSize="10.5pt" lineHeight={1.2} flex={4}>포인트 : </Typography>
                      <Typography fontSize="10.5pt" lineHeight={1.2} flex={7} textAlign="right">{Api.comma(order.order_point)} P</Typography>
                    </Box>
                    <Box display="flex" flexDirection="row" mb={0.5}>
                      <Typography fontSize="10.5pt" lineHeight={1.2} flex={4}>쿠폰할인 : </Typography>
                      <Typography fontSize="10.5pt" lineHeight={1.2} flex={7} textAlign="right">{Api.comma(order.order_coupon)} 원</Typography>
                    </Box>
                    <Box display="flex" flexDirection="row" mb={2}>
                      <Typography fontSize="10.5pt" lineHeight={1.2} flex={4}>결제방법 : </Typography>
                      <Typography fontSize="10.5pt" lineHeight={1.2} flex={7} textAlign="right">{order.od_settle_case}</Typography>
                    </Box>
                    <Divider />
                    <Box display="flex" flexDirection="row" mt={2} mb={1}>
                      <Typography fontSize="12pt" fontWeight="bold" lineHeight={1.2} flex={4}>총 결제금액 : </Typography>
                      <Typography fontSize="12pt" fontWeight="bold" lineHeight={1.2} flex={7} textAlign="right">{Api.comma(order.order_sumprice)} 원</Typography>
                    </Box>
                  </Box>
                  <Divider />
                </Box>
              </Box>
            </Fade>
          </Modal>

          : null
      }
      <Box style={{ display: 'none' }}>
        <OrderPrint ref={componentRef} />
      </Box>
    </>
  )
};

export default PrintModal;