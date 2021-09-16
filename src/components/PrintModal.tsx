import * as React from "react";
import { useSelector } from "react-redux";
import * as path from 'path';
import moment from 'moment';
import 'moment/locale/ko';

import Api from "../Api";

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { theme, baseStyles } from '../styles/base';
import { Divider, IconButton } from "@material-ui/core";
import { useReactToPrint } from 'react-to-print';

import PrintIcon from '@material-ui/icons/Print';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

// import OrderPrint from './ComponentToPrint';
import appRuntime from '../appRuntime';


const PrintModal = (props: any) => {
  const { mt_store } = useSelector((state: any) => state.login);
  const { order, product, store } = useSelector((state: any) => state.orderDetail);

  const base = baseStyles();

  // 프린트 출력 부분
  const componentRef = React.useRef(null);

  //　일반적인 웹형식 프린트출력(프린트 선택 dialog 뜸) 
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current
  // });

  // 일렉트론쪽 프린트 출력
  const handlePrint = () => {
    return new Promise((res, rej) => {
      if (order !== null && product !== null && store !== null) {
        const htmlFormat = `
        <style>
          @page { margin: 0; margin-bottom: 20px; }
          @media print {
            .print_area {
              margin-bottom: 50mm;
            }
          }
        </style>
        <div class='print_area' style='width: 100%;'>
          <h5 style='text-align: center; font-size: 12pt; font-weight: bold; margin-bottom: 10px'>매장 주문전표</h5>
          <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
            <tr>
              <td style='text-align: left; font-size: 11pt; font-weight: bold; letter-spacing: -1;'>주문번호${order.order_id}</td>
            </tr>
            <tr>
              <td style='text-align: left; font-size: 11pt; font-weight: bold; letter-spacing: -1;'>결제방식${order.od_settle_case}</td>
            </tr>
          </table>
          <hr style='margin: 5px 0;' />
          <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
            <tr>
              <td style='text-align: left; font-size: 9.6pt; letter-spacing: -1;'>매장주소</td>
            </tr>
            <tr>
              <td style='text-align: left; font-size: 11pt; font-weight: bold; letter-spacing: -1;'>${order.order_addr1}${order.order_addr3}</td>
            </tr>
            <tr>
              <td style='text-align: left; font-size: 9.6pt; letter-spacing: -1;'>${order.od_addr_jibeon}</td>
            </tr>
          </table>
          <hr style='margin: 5px 0;' />
          <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
            <tr>
              <td style='text-align: left; font-size: 9.6pt; letter-spacing: -1;'>연락처</td>
            </tr>
            ${order.order_safety_number ?
            `<tr>
                <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${order.order_safety_number}</td>
              </tr>
              <tr>
                <td style='text-align: left; font-size: 9.6pt; letter-spacing: -1;'>${order.order_safety_str}</td>
              </tr>`
            :
            `<tr>
                <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.phoneFomatter(order.order_hp)}</td>
              </tr>`
          }
          </table>
          <hr style='margin: 5px 0;' />
          <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
            <colgroup>
              <col width='35%' />
              <col width='65%' />
            </colgroup>
            <tr colspan='2'>
              <th style='text-align: left; font-size: 9.6pt;'>요청사항</th>
            </tr>
            <tr>
              <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>가게 : </td>
              <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${order.order_seller ? order.order_seller : '요청사항이 없습니다.'}</td>
            </tr>
            <tr>
              <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>배달 : </td>
              <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${order.order_officer ? order.order_officer : '요청사항이 없습니다.'}</td>
            </tr>
          </table>
          <hr style='margin: 5px 0;' />
          <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
            <colgroup>
              <col width='70%' />
              <col width='10%' />
              <col width='20%' />
            </colgroup>
            <tr colspan='2'>
              <th style='text-align: left; font-size: 9.6pt; letter-spacing: -1;'>메뉴명</th>
              <th style='text-align: center; font-size: 9.6pt; letter-spacing: -1;'>수량</th>
              <th style='text-align: right; font-size: 9.6pt; letter-spacing: -1;'>금액</th>
            </tr>
            ${product?.map((item: any, index: number) => (
            `<tr key=${index}>
                <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${item.it_name}</td>
                <td style='text-align: center; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${item.ct_qty}</td>
                <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(item.ct_price)}</td>
              </tr>`
          ))}
          </table>
          <hr style='margin: 5px 0;' />
          <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
            <colgroup>
              <col width='35%' />
              <col width='65%' />
            </colgroup>
            <tr colspan='2'>
              <th style='text-align: left; font-size: 9.6pt; letter-spacing: -1;'>결제정보</th>
            </tr>
            <tr>
              <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>총 주문금액 :</td>
              <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(order.odder_cart_price)} 원</td>
            </tr>
            <tr>
              <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>배달팁 :</td>
              <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(order.order_cost)} 원</td>
            </tr>
            <tr>
              <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>포인트 :</td>
              <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(order.order_point)} P</td>
            </tr>
            <tr>
              <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>쿠폰할인 :</td>
              <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(order.order_coupon)} 원</td>
            </tr>
            <tr>
              <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>결제방법 :</td>
              <td style='text-align: right; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${order.od_settle_case}</td>
            </tr>
          </table>
          <hr style='margin: 5px 0;' />
          <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
            <colgroup>
              <col width='40%' />
              <col width='60%' />
            </colgroup>
            <tr>
              <td style='text-align: left; font-size: 11pt; letter-spacing: -1; font-weight: bold;'>총 결제금액 :</td>
              <td style='text-align:right;  font-size: 11pt; letter-spacing: -1; font-weight: bold;'>${Api.comma(order.order_sumprice)} 원</td>
            </tr>
          </table>
          <hr style='margin: 5px 0;' />
          <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
            <tr>
              <td style='text-align: left; font-size: 7pt; letter-spacing: -1;'>${store.mb_company}</td>
            </tr>
            <tr>
              <td style='text-align: left; font-size: 7pt; letter-spacing: -1;'>주문번호 : ${order.order_id}</td>
            </tr>
            <tr>
              <td style='text-align: left; font-size: 7pt; letter-spacing: -1;'>${moment(order.od_time, 'YYYY-MM-DD HH:mm:ss').format('YYYY.MM.DD HH;mm')}</td>
            </tr>
          </table>
          <hr style='margin: 5px 0;' />
          <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
            <tr>
              <td style='text-align: left; font-size: 9.6pt; letter-spacing: -1;'>${store.do_jumju_origin}</td>
            </tr>
          </table>
          <p>&nbsp;</p>
          <hr style='margin: 5px 0;' />
        </div>
      `
        res(appRuntime.send('pos_print', htmlFormat));
      } else {
        alert('주문 디테일이 없습니다.');
      }
    });
  }

  const handlePrint02 = () => {

    return new Promise((res, rej) => {
      if (order !== null && product !== null && store !== null) {
        const htmlFormat02 = `
        <style>
          @page { margin: 0; margin-bottom: 20px; }
          @media print {
            .print_area {
              margin-bottom: 50mm;
            }
          }
        </style>
        <div class='print_area' style='width: 100%;'>
          <h5 style='text-align: center; font-size: 12pt; font-weight: bold;'>${order.od_type} 주문전표</h5>
          <hr style='margin: 5px 0;' />
          <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
            <colgroup>
              <col width='35%' />
              <col width='65%' />
            </colgroup>
            <tr colspan='2'>
              <th style='text-align: left; font-size: 9.6pt;'>주문정보</th>
            </tr>
            <tr>
              <td style='text-align: left; font-size: 9.6pt;'>주문매장 :</td>
              <td style='text-align: right; font-size: 9.6pt;'>${store.mb_company}</td>
            </tr>
            <tr>
              <td style='text-align: left; font-size: 9.6pt;'>주문시간 :</td>
              <td style='text-align: right; font-size: 9.6pt;'>${moment(order.od_time).format('YYYY년 M월 D일, HH시 mm분')}</td>
            </tr>
            <tr>
              <td style='text-align: left; font-size: 9.6pt;'>주문방법 :</td>
              <td style='text-align: right; font-size: 9.6pt;'>${order.od_type}</td>
            </tr>
          </table>
          <hr style='margin: 5px 0;' />
          <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
            <colgroup>
              <col width='35%' />
              <col width='65%' />
            </colgroup>
            <tr colspan='2'>
              <th style='text-align: left; font-size: 9.6pt;'>주문메뉴</th>
            </tr>
            ${product.map((item: any, index: number) => (
          `<tr colspan='2'><td key=${index} style='text-align: left; font-size: 9.6pt;' >메뉴 : ${item.it_name} / 옵션 - ${item.ct_option}</td></tr>`
        ))}
          </table>
          <hr style='margin: 5px 0;' />
          <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
            <colgroup>
              <col width='35%' />
              <col width='65%' />
            </colgroup>
            <tr colspan='2'>
              <th style='text-align: left; font-size: 9.6pt;'>배달정보</th>
            </tr>
            <tr>
              <td style='text-align: left; font-size: 9.6pt;'>배달주소 :</td>
              <td style='text-align: right; font-size: 9.6pt;'>${order.order_addr1}${order.order_addr3}</td>
            </tr>
            <tr>
              <td style='text-align: left; font-size: 9.6pt;'>전화번호 :</td>
              <td style='text-align: right; font-size: 9.6pt;'>${Api.phoneFomatter(order.order_hp)}</td>
            </tr>
          </table>
          <hr style='margin: 5px 0;' />
          <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
            <colgroup>
              <col width='35%' />
              <col width='65%' />
            </colgroup>
            <tr colspan='2'>
              <th style='text-align: left; font-size: 9.6pt;'>요청사항</th>
            </tr>
            <tr>
              <td style='text-align: left; font-size: 9.6pt;'>사장님께 :</td>
              <td style='text-align: right; font-size: 9.6pt;'>${order.order_seller ? order.order_seller : '요청사항이 없습니다.'}</td>
            </tr>
            <tr>
              <td style='text-align: left; font-size: 9.6pt;'>기사님께 :</td>
              <td style='text-align: right; font-size: 9.6pt;'>${order.order_officer ? order.order_officer : '요청사항이 없습니다.'}</td>
            </tr>
          </table>
          <hr style='margin: 5px 0;' />
          <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
            <colgroup>
              <col width='35%' />
              <col width='65%' />
            </colgroup>
            <tr colspan='2'>
              <th style='text-align: left; font-size: 9.6pt;'>결제정보</th>
            </tr>
            <tr>
              <td style='text-align: left; font-size: 9.6pt;'>총 주문금액 :</td>
              <td style='text-align: right; font-size: 9.6pt;'>${Api.comma(order.odder_cart_price)} 원</td>
            </tr>
            <tr>
              <td style='text-align: left; font-size: 9.6pt;'>배달팁 :</td>
              <td style='text-align: right; font-size: 9.6pt;'>${Api.comma(order.order_cost)} 원</td>
            </tr>
            <tr>
              <td style='text-align: left; font-size: 9.6pt;'>포인트 :</td>
              <td style='text-align: right; font-size: 9.6pt;'>${Api.comma(order.order_point)} P</td>
            </tr>
            <tr>
              <td style='text-align: left; font-size: 9.6pt;'>쿠폰할인 :</td>
              <td style='text-align: right; font-size: 9.6pt;'>${Api.comma(order.order_coupon)} 원</td>
            </tr>
            <tr>
              <td style='text-align: left; font-size: 9.6pt;'>결제방법 :</td>
              <td style='text-align: right; font-size: 9.6pt;'>${order.od_settle_case}</td>
            </tr>
          </table>
          <hr style='margin: 5px 0;' />
          <table style='width: 100%; border-collapse: collapse; border-spacing: 0;'>
            <colgroup>
              <col width='40%' />
              <col width='60%' />
            </colgroup>
            <tr>
              <td style='text-align: left; font-size: 9.6pt; font-weight: bold'>총 결제금액 :</td>
              <td style='text-align:right;  font-size: 9.6pt; font-weight: bold'>${Api.comma(order.order_sumprice)} 원</td>
            </tr>
          </table>
          <p>&nbsp;</p>
          <hr style='margin: 5px 0;' />
        </div>
      `
        setTimeout(() => {
          res(appRuntime.send('pos_print', htmlFormat02));
        }, 1000);

      } else {
        alert('주문 디테일이 없습니다.');
      }
    })
  }

  const printHandler = () => {
    handlePrint().then(() => handlePrint02()).catch((err: any) => console.error(err));
  }

  return (
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
          <Box display="flex" flexDirection="column">
            <div className='print_no_area' style={{ zIndex: 99999 }}>
              <Box display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center" style={{ backgroundColor: theme.palette.primary.main }}>
                {/* <FontAwesomeIcon icon={faPrint} size="1x" /> */}
                <IconButton
                  className='no-drag-area'
                  onClick={printHandler}
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
            {mt_store && order && product && store ?
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
                    <Typography fontSize="10.5pt" lineHeight={1.2} flex={10} textAlign="right">{moment(order.od_time).format('YYYY년 M월 D일, HH시 mm분')}</Typography>
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
                    <Typography fontSize="10.5pt" lineHeight={1.2} flex={10} textAlign="right">{Api.phoneFomatter(order.order_hp)}</Typography>
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
              : <Typography>주문 디테일을 불러오고 있습니다.</Typography>}
          </Box>
        </Fade>
      </Modal>

      {/* <Box style={{ display: 'none' }}>
        <OrderPrint ref={componentRef} />
      </Box> */}
    </>
  )
};

export default PrintModal;