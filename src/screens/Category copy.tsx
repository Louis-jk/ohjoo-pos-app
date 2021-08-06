import React from 'react';
import { Box, Button } from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Header';
import { theme, MainBox, baseStyles, ModalCancelButton, ModalConfirmButton } from '../styles/base';

export default function Category() {
  const base = baseStyles();
  const [audio] = React.useState(new Audio('https://dmonster1452.cafe24.com/api/sound.mp3'));
  const notify = () => {
    // toast("Wow so easy!");
    toast.success("Success Notification !", {
      position: toast.POSITION.TOP_RIGHT
    });
    audio.play();
  }

  return (
    <Box component="div" className={base.root}>
      <Header />
      <MainBox component='main' sx={{ flexGrow: 1, p: 3 }}>
        <Button onClick={notify}>Notify!</Button>
        <ToastContainer />
      </MainBox>
    </Box>
  )
}