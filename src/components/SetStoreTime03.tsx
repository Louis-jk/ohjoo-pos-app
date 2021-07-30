import React from 'react';
import { Box, Typography } from '@material-ui/core';
import Header from '../components/Header';
import { MainBox } from '../styles/base';

export default function SetStoreTime01() {

  return (
    <Box component="div">
      <Header />
      <MainBox component='main' sx={{ flexGrow: 1, p: 3 }}>
        <Typography>안녕하세요03</Typography>
      </MainBox>
    </Box>
  )
}