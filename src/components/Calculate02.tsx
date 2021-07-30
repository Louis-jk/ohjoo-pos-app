import React, { useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Api from '../Api';

export default function CalculateTab02() {

  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date(),
  );

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  function ListItemLink(props: ListItemProps<'a', { button?: true }>) {
    return <ListItem button component="a" {...props} />;
  }

  const calculateData = [
    {
      date: '2021.07.09',
      isCalculated: false,
      price: '5795000'
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
