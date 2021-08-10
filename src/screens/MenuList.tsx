import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Material UI Components
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

// Material icons
import CircularProgress from '@material-ui/core/CircularProgress';

// Local Component
import Api from '../Api';
import Header from '../components/Header';
import { MainBox, theme, baseStyles } from '../styles/base';
import { MenuStyles } from '../styles/custom';


interface Props {
  [key: string]: string;
}

export default function MenuList(props: any) {

  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);
  const base = baseStyles();
  const menu = MenuStyles();
  const [isLoading, setLoading] = React.useState(false);
  const [lists, setLists] = React.useState<Props[]>([]);

  const getMenusHandler = () => {
    setLoading(true);

    const param = {
      item_count: 0,
      limit_count: 10,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code
    };
    Api.send('store_item_list', param, (args: any) => {
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
  }

  React.useEffect(() => {
    getMenusHandler();
  }, [mt_id, mt_jumju_code])


  return (
    <Box component="div" className={base.root}>
      <Header type="menu" />
      {isLoading ?
        <Box className={base.loadingWrap}>
          <CircularProgress disableShrink color="primary" style={{ width: 50, height: 50 }} />
        </Box>
        :
        <MainBox component='main' sx={{ flexGrow: 1, p: 3 }}>
          <Grid container spacing={3}>
            {lists && lists.length > 0 && lists.map((list, index) => (
              <Grid key={list.it_id} item xs={12} md={6}>
                <Link to={`/menu_edit/${list.it_id}`}>
                  <Paper className={menu.menuListPaper}>
                    <Box className={menu.menuListWrap}>
                      {list.it_img1 &&
                        <Box>
                          <img src={list.it_img1} className={menu.menuListImg} alt={list.it_name} />
                        </Box>
                      }
                      <Box className={menu.menuListTextWrap}>
                        <Box className={menu.menuListTitle}>
                          <Typography component="p" mr={1} fontWeight="bold">{list.ca_name}</Typography>
                          {list.it_type1 === '1' ? <span className={menu.menuListLabel01}>대표메뉴</span> : null}
                          {list.it_use === '1' ? <span className={menu.menuListLabel02}>판매중</span> : <span className={menu.menuListLabel03}>판매중지</span>}
                        </Box>
                        <p className={menu.menuListName}>{list.it_name}</p>
                        <p className={menu.menuListPrice}>{Api.comma(list.it_price)}원</p>
                      </Box>
                    </Box>
                  </Paper>
                </Link>
              </Grid>
            ))}
            {lists.length === 0 || lists === null ?
              <Box style={{ display: 'flex', flex: 1, height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
                <Typography style={{ fontSize: 15 }}>등록된 메뉴가 없습니다.</Typography>
              </Box>
              : null}
          </Grid>
        </MainBox>
      }
    </Box>
  );
}