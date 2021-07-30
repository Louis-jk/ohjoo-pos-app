import React, { useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Api from '../Api';

interface IYear {
  label: string;
  value: number;
}

export default function CalculateTab01() {

  const [open, setOpen] = React.useState(false);
  const [year, setYear] = React.useState<number | string>('');
  const [month, setMonth] = React.useState<number | string>('');

  // 년도 배열 만들기
  const [yearArr, setYearArr] = React.useState<IYear[]>([]);
  const getYearRangeHandler = (param1: number, param2: number) => {

    let arr: IYear[] = [];

    let start = param1;
    let end = param2;

    let i = start;
    for (i; i <= end; i++) {
      // arr.push(i);
      arr.push({
        label: i + '년',
        value: i
      });
    }

    setYearArr(arr);
  };

  React.useEffect(() => {
    const getNow = new Date();
    const getNowYear = getNow.getFullYear();
    const getNowMonth = getNow.getMonth() + 1;

    setYear(Number(getNowYear));
    setMonth(getNowMonth);
    getYearRangeHandler(2015, getNowYear);
  }, [])

  console.log("yearArr", yearArr);


  const yearHandleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setYear(Number(event.target.value) || '');
  };

  const monthHandleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setMonth(Number(event.target.value) || '');
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const calculateData = [
    {
      date: '2021.07.09',
      isCalculated: false,
      price: '10795000'
    },
    {
      date: '2021.07.08',
      isCalculated: true,
      price: '5795000'
    },
    {
      date: '2021.07.07',
      isCalculated: true,
      price: '5795000'
    },
    {
      date: '2021.07.06',
      isCalculated: true,
      price: '5795000'
    },
    {
      date: '2021.07.05',
      isCalculated: true,
      price: '5795000'
    },
    {
      date: '2021.07.04',
      isCalculated: true,
      price: '5795000'
    }
  ]

  console.log("year", year);
  console.log("year type", typeof year);
  console.log("month", month);
  console.log("month type", typeof month);



  return (
    <section style={{ flex: 1 }}>

      <List component="nav" aria-label="secondary mailbox folders">
        {calculateData && calculateData.map((data, index) =>
          <ListItem key={index} button divider onClick={() => alert('클릭')}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ListItemText style={{ marginRight: 20 }}>
                {data.date}
              </ListItemText>
              <ListItemText>
                {data.isCalculated ? '정산완료' : '정산중'}
              </ListItemText>
            </div>
            <ListItemText style={{ textAlign: 'right' }}>
              {Api.comma(data.price)}원
            </ListItemText>
          </ListItem>
        )}
      </List>
    </section>
  );
}
