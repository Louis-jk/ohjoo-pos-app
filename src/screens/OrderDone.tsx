import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@material-ui/core';

import Header from '../components/Header';
import OrderCard from '../components/OrderCard';
import Api from '../Api';
import { theme, MainBox, baseStyles, ModalCancelButton, ModalConfirmButton } from '../styles/base';

export default function OrderDone() {

  const base = baseStyles();
  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);
  const [isLoading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  const getOrderListHandler = () => {

    setLoading(true);

    const param = {
      item_count: 0,
      limit_count: 10,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      od_process_status: '배달완료'
    };
    Api.send('store_order_list', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        console.log("success?", arrItems)
        setList(arrItems);
        setLoading(false);
      } else {
        console.log("faild?", arrItems)
        setList([]);
        setLoading(false);
      }
    });
  }

  useEffect(() => {
    getOrderListHandler();
  }, [mt_id, mt_jumju_code]);

  return (

    <Box component="div" className={base.root}>
      <Header />
      <MainBox component='main' sx={{ flexGrow: 1, p: 3 }}>
        <OrderCard orders={list} type="done" />
      </MainBox>
    </Box>

  );
}