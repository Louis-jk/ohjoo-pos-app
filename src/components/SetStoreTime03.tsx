import React, { useState } from 'react';
import moment from 'moment';
import { theme, baseStyles } from '../styles/base';

import DayPicker, { LocaleUtils, DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import MomentLocaleUtils from 'react-day-picker/moment';
import 'moment/locale/ko';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { Typography, IconButton } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

function formatMonthTitle(d: any, locale: any) {
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월`
}

export default function StoreTimeTab03() {

  const base = baseStyles();
  const [selectedDays, setSelectedDays] = useState([]);


  const modifiers = {
    thursdays: { daysOfWeek: [4] },
    birthday: new Date(2018, 9, 30),

  };

  const modifiersStyles = {
    birthday: {
      color: 'white',
      backgroundColor: theme.palette.primary.main,
    },
    // thursdays: {
    //   color: '#ffc107',
    //   backgroundColor: '#fffdee',
    // },
  }

  const handleDayClick = (day: any) => {

    let formatDay = moment(day).format('YYYY-MM-DD');

    const filtered = selectedDays.find(selectedDay => moment(selectedDay).format('YYYY-MM-DD') === formatDay);
    console.log("filtered ?", filtered);

    if (filtered) {
      const removeObj = selectedDays.filter(selectedDay => moment(selectedDay).format('YYYY-MM-DD') !== formatDay);
      console.log("removeObj", removeObj);
      setSelectedDays(removeObj);
    } else {
      let result = selectedDays.concat(day);
      setSelectedDays(result);
    }
  }

  console.log("selectedDays ???", selectedDays);

  return (
    // <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" width="100%">

    <DayPicker
      localeUtils={{ ...MomentLocaleUtils, formatMonthTitle }}
      locale="ko"
      selectedDays={selectedDays}
      onDayClick={handleDayClick}
      modifiers={modifiers}
      modifiersStyles={modifiersStyles}
    />

    // </Box >
  )
}