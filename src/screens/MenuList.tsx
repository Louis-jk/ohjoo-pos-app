import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Material UI Components
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/core/Pagination';
import Stack from '@material-ui/core/Stack';

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
  const [isLoading, setLoading] = useState(false);
  const [lists, setLists] = useState<Props[]>([]);

  const [currentPage, setCurrentPage] = useState(1); // 페이지 현재 페이지
  const [startOfIndex, setStartOfIndex] = useState(0); // 페이지 API 호출 start 인덱스
  const [postPerPage, setPostPerPage] = useState(6); // 페이지 API 호출 Limit
  const [totalCount, setTotalCount] = useState(0); // 아이템 전체 갯수

  // 현재 메뉴 
  const indexOfLastList = currentPage * postPerPage;
  const indexOfFirstList = indexOfLastList - postPerPage;
  const currentLists = lists.slice(indexOfFirstList, indexOfLastList);

  // 메뉴 가져오기 핸들러
  const getMenusHandler = () => {
    setLoading(true);

    const param = {
      item_count: startOfIndex,
      limit_count: postPerPage,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code
    };

    console.log("param ?", param);

    Api.send('store_item_list', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      let toTotalCount = Number(resultItem.total_cnt);
      setTotalCount(toTotalCount);

      let totalPage = Math.ceil(toTotalCount / postPerPage);

      setTotalCount(totalPage);

      console.log("args", args);
      console.log("resultItem total_cnt", resultItem.total_cnt);

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
  }, [mt_id, mt_jumju_code, startOfIndex])

  console.log("currentPage", currentPage);
  console.log("postPerPage", postPerPage);


  // 페이지 전환 핸들러
  const pageHandleChange = (event: any, value: any) => {

    if (value === 1 || value < 1) {
      setStartOfIndex(0);
    } else {
      let start = (value - 1) * postPerPage;
      setStartOfIndex(start);
    }
    setCurrentPage(value);
  }

  return (
    <Box component="div" className={base.root}>
      <Header type="menu" />
      {isLoading ?
        <MainBox component='main' sx={{ flexGrow: 1, p: 3 }} style={{ borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
          <Box className={base.loadingWrap}>
            <CircularProgress disableShrink color="primary" style={{ width: 50, height: 50 }} />
          </Box>
        </MainBox>
        :
        <MainBox component='main' sx={{ flexGrow: 1, p: 3 }} style={{ borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
          <Box mt={3} />
          {lists && lists.length > 0 &&
            <Grid container spacing={3} style={{ minHeight: 520 }}>
              {lists.map((list, index) => (
                <Grid key={list.it_id} item xs={12} md={6} alignContent='baseline'>
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
            </Grid>
          }
          {lists.length === 0 || lists === null ?
            <Box style={{ display: 'flex', flex: 1, height: 'calc(100vh - 160px)', justifyContent: 'center', alignItems: 'center' }}>
              <Typography style={{ fontSize: 15 }}>등록된 메뉴가 없습니다.</Typography>
            </Box>
            : null}
          {totalCount ?
            <Box mt={7} display='flex' justifyContent='center' alignSelf="center">
              <Stack spacing={2}>
                <Pagination
                  color="primary"
                  count={totalCount}
                  defaultPage={1}
                  showFirstButton
                  showLastButton
                  onChange={pageHandleChange}
                  page={currentPage}
                />
                {/* 
                토탈 페이지수 = count
                초기 페이지 번호 = defaultPage
              */}
              </Stack>
            </Box>
            : null}
        </MainBox>
      }
    </Box>
  );
}