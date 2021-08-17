import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import 'moment/locale/ko';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker, { Calendar, DayValue, DayRange, Day } from 'react-modern-calendar-datepicker'

// Material UI Components
import Chip from '@material-ui/core/Chip';
import Stack from '@material-ui/core/Stack';
import Grid from '@material-ui/core/Grid';

// Local Component
import { myCustomLocale } from '../assets/datas/calendar_locale';
import Api from '../Api';
import { theme, baseStyles } from '../styles/base';

export default function StoreTimeTab03() {

  const base = baseStyles();
  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);
  const [selectedDayRange, setSelectedDayRange] = useState<Day[]>([]); // 마커용
  const [dayFormatArray, setDayFormatArray] = useState<string[]>([]); // 리스트용 - Chip

  // 리스트용 포맷 핸들러
  const dayFormatHandler = (dates: any) => {
    console.log("dayFormatHandler 눌린거 들고온 데이트 ?", dates);
    let result = dates.map((date: any, index: number) => {
      return date.year + '-' + date.month + '-' + date.day;
    })

    setDayFormatArray(result);

    // API 휴무일 업데이트
    let lastDate = dates[dates.length - 1];
    let lastDateToStr = lastDate.year + '-' + lastDate.month + '-' + lastDate.day;
    let formatApiDate = moment(lastDateToStr, 'YYYY-MM-DD').format('YYYY-MM-DD');
    selectHolidayHandler(formatApiDate);
  }

  // 휴무일 가져오기 
  const getStoreClosedHandler = () => {
    const param = {
      encodeJson: true,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      mode: 'list'
    };

    Api.send('store_hoilday', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {

        let obj: Day; // 캘린더 Day type 지정(마커용)
        let toArr: Day[] = []; // 빈배열 생성 (캘린더 Day[] 타입 지정)(마커용)
        let toChipArr: string[] = []; // 빈배열 생성(리스트용 - Chip)

        arrItems.map((date: any) => {

          // API에서 가져온 날짜 형식 moment로 포맷(마커용)
          let year = moment(date.sh_date, 'YYYY-MM-DD').format('YYYY');
          let month = moment(date.sh_date, 'YYYY-MM-DD').format('MM');
          let day = moment(date.sh_date, 'YYYY-MM-DD').format('DD');

          // moment로 포맷한 string Data 캘린더 Day type형식에 맞게 숫자로 변환(마커용)
          let yearToNum = Number(year);
          let monthToNum = Number(month);
          let dayToNum = Number(day);

          // 캘린더 Day type 형식에 맞춘 Data, Day type 새 오브젝트에 대입(마커용)
          obj = {
            day: dayToNum,
            month: monthToNum,
            year: yearToNum
          }
          toArr.push(obj);

          toChipArr.push(date.sh_date);
        });

        // 대입된 값들을 캘린더 상태값에 저장(마커용)
        setSelectedDayRange(toArr);

        // 대입된 값들 상태값에 저장(리스트용 - Chip)
        setDayFormatArray(toChipArr);

      } else {

      }
    });
  }

  useEffect(() => {
    getStoreClosedHandler();
  }, []);


  // 휴무일 업데이트 핸들러
  const selectHolidayHandler = (date: string) => {

    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      sh_date: date,
      mode: 'update'
    };

    console.log("param은?", param);

    Api.send('store_hoilday', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        console.log('업데이트 완료');
      } else {
        console.log('업데이트 실패');
      }
    });
  };

  // 리스트 - Chip 에서 날짜 삭제 핸들러
  const handleDelete = (date: string) => {
    console.log("handleDelete date?", date);
    console.log("handleDelete date type?", typeof date);
    let filtered = dayFormatArray.filter(chipDate => chipDate !== date);
    setDayFormatArray(filtered);

    // 리스트용 - Chip 삭제 필터
    let obj: Day;
    let yearToNum = Number(moment(date, 'YYYY-MM-DD').format('YYYY'));
    let monthToNum = Number(moment(date, 'YYYY-MM-DD').format('MM'));
    let dayToNum = Number(moment(date, 'YYYY-MM-DD').format('DD'));

    obj = {
      day: dayToNum,
      month: monthToNum,
      year: yearToNum
    }

    // 마커 삭제
    let markerFiltered = selectedDayRange.filter(markerDate => JSON.stringify(markerDate) !== JSON.stringify(obj));
    setSelectedDayRange(markerFiltered);

    // API 휴무일 업데이트
    let formatApiDate = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');
    selectHolidayHandler(formatApiDate);
  };


  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={6}>
          <Calendar
            value={selectedDayRange}
            onChange={(day) => {
              setSelectedDayRange(day);
              dayFormatHandler(day);
              // console.log("보자 day", day);
            }}
            shouldHighlightWeekends
            locale={myCustomLocale}
            colorPrimary={theme.palette.primary.main}
            calendarClassName="custom-calendar"
            calendarTodayClassName="custom-today-day"
          />
        </Grid>
        <Grid item md={6}>
          <Stack direction="row" flexWrap='wrap'>
            {dayFormatArray?.map((date, index) => (
              <Chip key={date + index} label={moment(date).format('YYYY-MM-DD')} variant="outlined" sx={{ m: 1 }} onDelete={() => handleDelete(date)} />
            ))}
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}