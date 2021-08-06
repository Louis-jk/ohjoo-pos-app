import React from 'react';
import { Box, Typography } from '@material-ui/core';
import Header from '../components/Header';
import { theme, MainBox, baseStyles, ModalCancelButton, ModalConfirmButton } from '../styles/base';

export default function SetStoreTime01() {

  const base = baseStyles();

  return (
    <Box component="div" className={base.root}>
      <Header />
      <MainBox component='main' sx={{ flexGrow: 1, p: 3 }}>
        <Typography>안녕하세요03</Typography>
      </MainBox>
    </Box>
  )
}