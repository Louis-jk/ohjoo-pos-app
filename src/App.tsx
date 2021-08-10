import React, { useEffect } from 'react';
import { ToastContainer, toast, cssTransition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ThemeProvider } from '@material-ui/core/styles';

import Routes from './routes';
import { getToken, onMessageListener } from './firebaseConfig';
import { theme } from './styles/base';

function App() {
  const [audio] = React.useState(new Audio('https://dmonster1452.cafe24.com/api/sound.mp3'));
  const [notification, setNotification] = React.useState({ title: "", body: "" });
  const [isTokenFound, setTokenFound] = React.useState(false);

  const Zoom = cssTransition({
    enter: 'zoomIn',
    exit: 'zoomOut',
    appendPosition: true,
    collapse: true,
    collapseDuration: 300
  });

  toast.configure({
    autoClose: 6000,
    draggable: true,
    hideProgressBar: true,
    pauseOnHover: true,
    progressStyle: {
      color: 'yellow'
    }
  });

  // const options = {
  //   autoClose: 6000,
  //   type: toast.TYPE.INFO,
  //   hideProgressBar: true,
  //   position: toast.POSITION.BOTTOM_RIGHT,
  //   pauseOnHover: true,
  //   progress: 0.2,
  //   // and so on ...
  // };

  const handleClick = (title: string) => {
    toast.dark(title, {
      transition: Zoom,
      position: 'bottom-right',
      style: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
        boxShadow: '0 0 15px 7px rgba(147,98,142,0.2)'
      },
      progressStyle: {
        backgroundColor: theme.palette.secondary.main,
      }
    });
    audio.play();
  };

  getToken(setTokenFound);

  onMessageListener()
    .then((payload: any) => {
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body,
      });
      handleClick(payload.notification.title);
      console.log(payload);
    })
    .catch((err) => console.log("failed: ", err));

  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <Routes />
      </ThemeProvider>
      <ToastContainer />
    </React.StrictMode>
  );
}

export default App;
