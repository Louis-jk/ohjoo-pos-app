import { app, BrowserWindow, Menu, clipboard, ipcMain, ipcRenderer } from 'electron';
import * as path from 'path';
import { PosPrinter, PosPrintData, PosPrintOptions } from "electron-pos-printer";

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

    // const contents = mainWindow.webContents;
    // console.log("electron contents ::", contents);
    // const printer = contents.getPrinters();
    // console.log("electron printer ::", printer);

}

// 브라우저 메뉴창 없애기
Menu.setApplicationMenu(null);

// const contents = mainWindow.webContents;
// contents.on('did-finish-load', () => {
//   let code = `var promise = Promise.resolve(document.getElementById('print_box').innerHTML);
//               promise.then(data => data).catch(err => console.error('promise error:', err))`;
//     contents.executeJavaScript(code, true)
//     .then((result) => {
//       console.log('innerHtml result ::', result);
//     }).catch(err => console.error('result error : ', err));
// })

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

// 프린트 테스트
const options: PosPrintOptions = {
  preview: true,
  silent: false,
  width: '170px',       
  margin: '0 0 0 0',    
  copies: 1,
  printerName: 'EPSON_L6190_Series',
  timeOutPerLine: 2000,
  pageSize: { height: 301000, width: 71000 } // page size
}


ipcMain.on('printTest', (event, arg) => {
  // mainWindow.webContents.print({})
  // console.log('printTest Data::', data);
  // mainWindow.webContents.print(data);
  // let html = mainWindow.loadURL(data);
  // console.log("data ::", JSON.parse(arg));

  let data = JSON.parse(arg);

  PosPrinter.print(data, options).then(() => {}).catch((error: any) => console.error('print error :: ', error));
})

ipcMain.on('printFin', (event, arg) => {
  // console.log("arg ?", arg);
  clipboard.writeHTML('<b>Test</b>');
  const html = clipboard.readHTML();
  console.log("html ?", html);
  mainWindow.webContents.print(html);
})

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