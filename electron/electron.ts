import { app, BrowserWindow, Menu, ipcMain, ipcRenderer, MessageChannelMain, BrowserView, Notification, shell } from 'electron';
import * as path from 'path';

let mainWindow: Electron.BrowserWindow | null;
// declare global {
//     interface Window {
//       require: any;
//     }
//   }

// const isDev = !app.isPackaged;

function createWindow() {
    mainWindow = new BrowserWindow({
        autoHideMenuBar: true,
        width: 1024,
        height: 768,
        backgroundColor: 'white',
        icon: path.join(app.getAppPath(), '/build/assets/icons/png/64x64.png'),
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          preload: path.resolve(__dirname, 'preload.js'),
        }
    });

    // index.html 파일 로드
    mainWindow.loadFile(path.join(app.getAppPath(), 'index.html'));
    // mainWindow.loadFile(path.join(__dirname, 'index.html'));
    
    // 기본 메뉴 숨기기
    mainWindow.setMenuBarVisibility(false);
    
    // mainWindow.loadURL('https://localhost:3000/')

    // 개발자 툴 오픈
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    const contents = mainWindow.webContents;
    console.log("electron contents ::", contents);
    const printer = contents.getPrinters();
    console.log("electron printer ::", printer);

}

// 브라우저 메뉴창 없애기
Menu.setApplicationMenu(null);

// 프린트 정보 보내기
// ipcRenderer.send('test', 'ping');

// 프린트 정보 열기
ipcMain.on('openPrint', (event, data) => {
  const printerInfo = mainWindow.webContents.getPrinters();
  console.log('printerInfo ??', printerInfo);
  event.sender.send('printInfo', printerInfo);
})

// 프린트 
ipcMain.on('print', (event, data) => {
    console.log("print on message!");
    console.log("print data:: ", data);
    mainWindow.webContents.print({
      silent: true,
      printBackground: true,
      color: false,
      landscape: false,
      pagesPerSheet: 1,
      collate: false,
      copies: 1,
      header: 'Header of the Page',
      footer: 'Footer of the Page',
      pageSize: 'Legal'
    },
    (success, failureReason) => {
      if(!success) console.log(failureReason);
      console.log('Print Initiated');
    }
    )
});

ipcMain.handle('quit-app', () => {
  app.quit();
});

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