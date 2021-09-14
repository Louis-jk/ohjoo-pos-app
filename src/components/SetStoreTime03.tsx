import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import 'moment/locale/ko';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
// import DatePicker, { Calendar, DayValue, DayRange, Day } from 'react-modern-calendar-datepicker'
import { ko } from "date-fns/esm/locale";
// import Calendar from 'react-calendar'; range 기능밖에 안됨 지워야됨
// import 'react-calendar/dist/Calendar.css'; range 기능밖에 안됨 지워야됨

import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

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
  // const [selectedDayRange, setSelectedDayRange] = useState<Day[]>([]); // 마커용
  const [dayFormatArray, setDayFormatArray] = useState<string[]>([]); // 리스트용 - Chip

  
  // 리스트용 포맷 핸들러
//   const dayFormatHandler = () => {
//     
//     let result = selectedDayRange.map((date: any, index: number) => {
//        let changeDate = date.year + '-' + date.month + '-' + date.day;
//        let formatDate = moment(changeDate, 'YYYY-M-DD').format('YYYY-MM-DD');
//        return formatDate;
//     })
//     
//     // setSelectedDayRange(day);
// 
//     setDayFormatArray(result);
// 
//     console.log("캘린더 찍었을 때 RESULT", result);
//     selectHolidayHandler(result);
// 
//     // API 휴무일 업데이트
//     // let lastDate = dates[dates.length - 1];
//     // let lastDateToStr = lastDate.year + '-' + lastDate.month + '-' + lastDate.day;
//     // let formatApiDate = moment(lastDateToStr, 'YYYY-MM-DD').format('YYYY-MM-DD');
//     // selectHolidayHandler(formatApiDate);
//   }

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

        console.log("휴무일 server resultItem :::", resultItem);
        console.log("휴무일 server arrItems:::", arrItems);

        let dateArr: Date[] = []; // 마커용 임시 배열
        let dateChipArr: string[] = [];

        arrItems.map((date: any, index: number) => {
          let result = new Date(date.sh_date);
          dateArr.push(result);

          let result02 = date.sh_date;
          dateChipArr.push(result02);
        })
        setSelectDays(dateArr);
        setDayFormatArray(dateChipArr);
      } else {
        console.log("휴무일을 가져오지 못했습니다");
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

    console.log("휴무일 업데이트 param >>>", param);

    Api.send('store_hoilday', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        console.log('업데이트 완료 result', resultItem);
        console.log('업데이트 완료', arrItems);
      } else {
        console.log('업데이트 실패');
      }
    });
  };

  // 리스트 - Chip 에서 날짜 삭제 핸들러
//   const handleDelete = (date: string) => {
//     console.log("handleDelete date?", date);
//     console.log("handleDelete date type?", typeof date);
// 
//     // Chip의 날짜 형식을 캘린더 형식으로 변경
//     let changeObj: Day;
//     let yearToNum = Number(moment(date, 'YYYY-MM-DD').format('YYYY'));
//     let monthToNum = Number(moment(date, 'YYYY-MM-DD').format('MM'));
//     let dayToNum = Number(moment(date, 'YYYY-MM-DD').format('DD'));
// 
//     changeObj = {
//       day: dayToNum,
//       month: monthToNum,
//       year: yearToNum
//     }
// 
//     // 선택된 Chip날짜를 Chip 배열에서 찾아서 제거
//     let filtered = dayFormatArray.filter(chipDate => chipDate !== date);
//     setDayFormatArray(filtered);
// 
//     // 캘린더 형식으로 변경된 날짜를 캘린더 배열에서 찾아서 제거
//     let CalendarResult = selectedDayRange.filter(date => JSON.stringify(date) !== JSON.stringify(changeObj));
//     setSelectedDayRange(CalendarResult);
// 
//     // API 휴무일 업데이트
//     // selectHolidayHandler(date);
//     
//   };

  const [selectedDays, setSelectDays] = useState<Date[]>([]); // 새로운 캘린더

    // 데이트 Select 핸들러
  const handleDayClick = (day: Date, { selected }: any) => {

    console.log('day', day);
    console.log('selected', selected);

    let formatDate = moment(day).format('YYYY-MM-DD');
    console.log('formatDate', formatDate);

    selectHolidayHandler(formatDate);

    const result = selectedDays.concat();
    if (selected) {
      const selectedIndex = result.findIndex(selectedDay =>
        DateUtils.isSameDay(selectedDay, day)
      );
      result.splice(selectedIndex, 1);
    } else {
      result.push(day);
    }
    console.log("result", result);
    setSelectDays(result);
  }

  const MONTHS = {
    ko: [
      '1월',
      '2월',
      '3월',
      '4월',
      '5월',
      '6월',
      '7월',
      '8월',
      '9월',
      '10월',
      '11월',
      '12월'
    ]
  };
 
  const WEEKDAYS_SHORT = {
    ko: [
      '일',
      '월',
      '화',
      '수',
      '목',
      '금',
      '토',
    ]
  };

  const LABELS = {
    ko: { nextMonth: '다음달', previousMonth: '이전달' }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={8}>
          <DayPicker
            months={MONTHS.ko}
            weekdaysShort={WEEKDAYS_SHORT.ko}
            labels={LABELS.ko}
            selectedDays={selectedDays}
            onDayClick={handleDayClick}
          />
        </Grid>
        <Grid item md={4}>
          <Stack direction="row" flexWrap='wrap'>
            {dayFormatArray?.map((date, index) => (
              <Chip key={date + index} label={date} variant='filled' color='primary' sx={{ m: 1 }} /* onDelete={() => handleDelete(date)} */ />
            ))}
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}