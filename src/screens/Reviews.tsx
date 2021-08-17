import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import moment from 'moment';
import 'moment/locale/ko';

// Material UI Components
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/core/Alert';
import Stack from '@material-ui/core/Stack';
import Rating from '@material-ui/core/Rating';
import Pagination from '@material-ui/core/Pagination';

// Material icons
import AddCommentOutlinedIcon from '@material-ui/icons/AddCommentOutlined';
import CancelIcon from '@material-ui/icons/Cancel';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

// Local Component
import Header from '../components/Header';
import Api from '../Api';
import { theme, MainBox, baseStyles, ModalCancelButton, ModalConfirmButton } from '../styles/base';


interface IReview {
  content: string;
  datetime: string;
  it_id: string;
  menu: string;
  num: string;
  pic: string[];
  pic_count: string;
  profile: string;
  rating: string;
  replayDate: string;
  reply: boolean;
  replyComment: string;
  subject: string;
  wr_id: string;
  wr_mb_id: string;
}

export default function Reviews(props: any) {

  const base = baseStyles();
  const { mt_id, mt_jumju_code, mt_name } = useSelector((state: any) => state.login);

  const [rate, setRate] = useState({}); // 별점
  const [currentPage, setCurrentPage] = useState(1); // 페이지 현재 페이지
  const [startOfIndex, setStartOfIndex] = useState(0); // 페이지 API 호출 start 인덱스
  const [postPerPage, setPostPerPage] = useState(3); // 페이지 API 호출 Limit
  const [totalCount, setTotalCount] = useState(0); // 아이템 전체 갯수
  const [lists, setLists] = useState<IReview[]>([]); // 리뷰 리스트

  const getReviewListHandler = () => {

    const param = {
      bo_table: 'review',
      item_count: startOfIndex,
      limit_count: postPerPage,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code
    };

    Api.send('store_review_list', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      let toTotalCount = Number(resultItem.total_cnt);
      setTotalCount(toTotalCount);

      let totalPage = Math.ceil(toTotalCount / postPerPage);

      setTotalCount(totalPage);
      console.log("reviews resultItem", resultItem);

      if (resultItem.result === 'Y') {
        setRate(arrItems.rate);
        setLists(arrItems.review);
      } else {
        setRate({});
        setLists([]);
      }
    });
  };

  useEffect(() => {
    getReviewListHandler();
  }, [mt_id, mt_jumju_code, startOfIndex])

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

  const [open, setOpen] = useState(false); // 코멘트 모달 

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [openAlert, setOpenAlert] = useState(false); // Alert 모달 

  const handleOpenAlert = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const [comment, setComment] = useState(''); // 리뷰 답글(업주 -> 고객)
  const [reviewId, setReviewId] = useState(''); // 리뷰 아이디
  const [reviewContent, setReviewContent] = useState(''); // 리뷰 컨텐츠(고객이 남긴 리뷰)
  const [reviewItId, setReviewItId] = useState(''); // 리뷰 메뉴 아이디
  const [reviewUserId, setReviewUserId] = useState(''); // 리뷰 유저 아이디
  const [reviewProfile, setRevieProfile] = useState(''); // 리뷰 유저 프로필
  const [reviewMenu, setRevieMenu] = useState(''); // 리뷰 선택 메뉴
  const [reviewRating, setReRating] = useState(''); // 리뷰 평점
  const [reviewDatetime, setRDatetime] = useState(''); // 리뷰 작성일자

  const sendReply = () => {
    if (comment === '' || comment === null) {
      // handleClose();
      // alert('답변을 작성해주세요.');
      handleOpenAlert();
    } else {
      const param = {
        jumju_id: mt_id,
        jumju_code: mt_jumju_code,
        bo_table: 'review',
        it_id: reviewItId,
        wr_id: reviewUserId,
        mode: 'comment',
        wr_content: comment,
        wr_name: mt_name,
      };

      Api.send('store_review_comment', param, (args: any) => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        console.log("리뷰 답변 resultItem ::", resultItem);
        console.log("리뷰 답변 arrItems ::", arrItems);

        if (resultItem.result === 'Y') {
          handleClose();
          alert('답변을 등록하였습니다.');
          getReviewListHandler();
        } else {
          handleClose();
          alert('답변을 등록하지 못하였습니다.\n확인 후 다시 시도해주세요.');
        }
      });
    }
  }

  const sendReplyHandler = (id: string, content: string, itId: string, userId: string, profile: string, menu: string, rating: string, datetime: string) => {
    setReviewId(id);
    setReviewContent(content);
    setReviewItId(itId);
    setReviewUserId(userId);
    setRevieProfile(profile);
    setRevieMenu(menu);
    setReRating(rating);
    setRDatetime(datetime);
    handleOpen();
  }

  console.log("rate", rate);
  console.log("list", lists);
  console.log("reviewId ?", reviewId);

  return (
    <Box component="div" className={base.root}>
      <Header type="review" />
      <div className={base.alertStyle}>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          open={openAlert}
          autoHideDuration={5000}
          onClose={handleCloseAlert}
        >
          <Alert onClose={handleCloseAlert} severity="error">
            코멘트를 입력해주세요.
          </Alert>
        </Snackbar>
      </div>
      {/* 리뷰 코멘트 입력 모달 */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={base.modal}
        open={open}
        // onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={base.modalInner}>
            {/* <h2 id="transition-modal-title">코멘트 입력</h2> */}
            <IconButton color="primary" aria-label="upload picture" component="span" onClick={handleClose} style={{ position: 'absolute', top: -10, right: -10, width: 30, height: 30, color: '#fff', backgroundColor: theme.palette.primary.main }}>
              <CloseRoundedIcon />
            </IconButton>
            <Box className={clsx(base.flexRow, base.mb10)}>
              <Avatar alt={`유저아이디: ${reviewId} 님의 프로필 사진`} src={reviewProfile} className={clsx(base.large, base.mr10)} />
              <Box>
                <Grid className={base.flexRow}>
                  <Grid className={clsx(base.title, base.mb05)}>
                    <Typography variant="body1" component="b" style={{ marginRight: 10 }}>{reviewMenu}</Typography>
                    <Typography variant="body1" component="b" style={{ marginRight: 10 }}>|</Typography>
                    <Typography variant="body1" component="b" style={{ marginRight: 10 }}>{reviewUserId}</Typography>
                  </Grid>
                </Grid>
                <Grid className={clsx(base.title, base.mb05)} style={{ display: 'flex', alignItems: 'center' }}>
                  <Rating name="half-rating-read" size="small" value={Number(reviewRating)} readOnly />
                  <Typography variant="body1" component="b" style={{ marginRight: 10 }}></Typography>
                  <Typography variant="body1" component="b">{moment(reviewDatetime, 'YYYYMMDD').fromNow()}</Typography>
                </Grid>
              </Box>
            </Box>
            <p id="transition-modal-description" className={base.reviewContent}>{reviewContent}</p>
            <TextField
              value={comment}
              fullWidth
              className={base.reviewMultiTxtField}
              id="outlined-multiline-static"
              label="답글입력"
              multiline
              rows={10}
              variant="outlined"
              onChange={e => setComment(e.target.value as string)}
            />
            <ButtonGroup variant="text" color="primary" aria-label="text primary button group" style={{ marginTop: 20 }}>
              <ModalConfirmButton variant="contained" style={{ boxShadow: 'none' }} className={base.confirmBtn} onClick={sendReply}>등록하기</ModalConfirmButton>
              <ModalCancelButton variant="outlined" className={base.confirmBtn} onClick={handleClose}>닫기</ModalCancelButton>
            </ButtonGroup>
          </div>
        </Fade>
      </Modal>
      {/* // 리뷰 코멘트 입력 모달 */}
      <MainBox component='main' sx={{ flexGrow: 1, p: 3 }}>
        {lists && lists.length > 0 && lists.map((list, index) =>
          <Grid item xs={12} key={index + list.wr_id + list.wr_mb_id}>
            <Paper className={base.reviewPaper} style={{ position: 'relative' }}>
              <Grid className={base.flexRow}>
                <Avatar alt={`유저아이디: ${list.wr_mb_id} 님의 프로필 사진`} src={list.profile} className={clsx(base.large, base.mr20)} />
                <Grid className={base.flexColumn}>
                  <Grid className={base.flexRow}>
                    <Grid className={clsx(base.title, base.mb05)}>
                      <Typography variant="body1" component="b" style={{ marginRight: 10 }}>{list.menu}</Typography>
                      <Typography variant="body1" component="b" style={{ marginRight: 10 }}>|</Typography>
                      <Typography variant="body1" component="b" style={{ marginRight: 10 }}>{list.wr_mb_id}</Typography>
                    </Grid>
                  </Grid>
                  <Grid className={clsx(base.title, base.mb05)} style={{ display: 'flex', alignItems: 'center' }}>
                    <Rating name="half-rating-read" size="small" value={Number(list.rating)} readOnly />
                    <Typography variant="body1" component="b" style={{ marginRight: 10 }}></Typography>
                    <Typography variant="body1" component="b">{moment(list.datetime, 'YYYYMMDD').fromNow()}</Typography>
                    <Box style={{ position: 'absolute', right: 10, top: 10 }}>
                      <Button
                        color="primary"
                        aria-label="button"
                        startIcon={<AddCommentOutlinedIcon />}
                        // style={{ color: theme.palette.primary.dark }}
                        onClick={() => sendReplyHandler(list.wr_id, list.content, list.it_id, list.wr_mb_id, list.profile, list.menu, list.rating, list.datetime)}
                      >
                        답글달기
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              {list.pic.length > 0 ?
                <Grid style={{ display: 'flex', flexDirection: 'row', marginTop: 20 }} spacing={3}>
                  {list.pic.map((image, index) =>
                    <Box key={index}>
                      <img src={image} style={{ width: 150, height: 150, borderRadius: 5, marginRight: 10 }} alt={image} />
                    </Box>
                  )}
                </Grid>
                : null}
              <Grid className={clsx(base.flexColumn, base.mt20, base.commantWrap)}>
                <Typography variant="body1" component="b">{list.content}</Typography>
              </Grid>
            </Paper>
          </Grid>
        )}
        {lists.length === 0 || lists === null ?
          <Box style={{ display: 'flex', flex: 1, height: '80vh', justifyContent: 'center', alignItems: 'center' }}>
            <Typography style={{ fontSize: 15 }}>등록된 리뷰가 없습니다.</Typography>
          </Box>
          : null}
        <Box mt={10} display='flex' justifyContent='center' alignSelf="center">
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
      </MainBox>
    </Box>
  );
}