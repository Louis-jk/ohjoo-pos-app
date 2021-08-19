import { app, BrowserWindow, BrowserView, ipcMain, Notification, shell } from 'electron';
import * as path from 'path';

let mainWindow: Electron.BrowserWindow | null;

// const isDev = !app.isPackaged;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        backgroundColor: 'white',
        icon: path.join(app.getAppPath(), '/build/assets/icons/png/64x64.png'),
        webPreferences: {
            nodeIntegration: false,
            worldSafeExecuteJavaScript: true,
            contextIsolation: true,
            // preload: path.join(__dirname, 'preload.js')
            preload: path.join(app.getAppPath(), 'preload.js')
        }
    });

    // index.html 파일 로드
    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // mainWindow.loadURL('https://localhost:3000/')

    // 개발자 툴 오픈
    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}


// Notification
// const NOTIFICATION_TITLE = 'Title-Inner';
// const NOTIFICATION_BODY = 'Notification from the Renderer process. Click to log to console.';
// const CLICK_MESSAGE = 'Notification clicked';

// function showNotification () {
//     new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
// }
  



// if (isDev) {
//     require('electron-reload')(__dirname, {
//       electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
//     })
//   }

// ipcMain.on('notify', (_, message) => {
//     new Notification({
//       title: 'Notifiation', 
//       body: message,
//       sound: path.join(__dirname, 'c_sound.wav')
//     }).show();
//   })

app.on('ready', createWindow);
// app.whenReady().then(createWindow).then(showNotification);

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if(mainWindow === null) {
        createWindow();
    }
});