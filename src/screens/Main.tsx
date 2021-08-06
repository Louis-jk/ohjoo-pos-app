import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

// Material UI Components
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

// Local Component
import Api from '../Api';
import storeAction from '../redux/actions';
import { baseStyles, theme } from '../styles/base';


export default function Main(props: any) {

  const base = baseStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);

  const [audio] = React.useState(new Audio('https://dmonster1452.cafe24.com/api/sound.mp3'));
  const [playing, setPlaying] = React.useState(false);
  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  },
    [playing]
  );

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  const getStoreHandler = () => {
    const param = {
      jumju_id: mt_id,
      item_count: 0,
      limit_count: 10
    };

    Api.send('store_jumju', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;
      console.log("store list result ", resultItem);
      console.log("store list", arrItems);
      if (resultItem.result === 'Y') {
        // let initialSelectStore = arrItems.filter(store => store.mt_id === mt_id);

        dispatch(dispatch(storeAction.updateStore(arrItems)));
        // dispatch(dispatch(storeAction.selectStore(initialSelectStore[0].id, initialSelectStore[0].mt_jumju_id, initialSelectStore[0].mt_jumju_code, initialSelectStore[0].mt_store, initialSelectStore[0].mt_addr)));
      }
      history.push('/order_new');
    });
  };

  useEffect(() => {
    getStoreHandler();
  }, []);

  return (
    <Box className={base.loadingWrap} style={{ flexDirection: 'column', backgroundColor: theme.palette.primary.main }}>
      <CircularProgress disableShrink color="secondary" style={{ width: 50, height: 50, marginBottom: 20 }} />
      <Typography style={{ color: theme.palette.primary.contrastText }}>등록된 상점 확인중</Typography>
    </Box>
  );
}
