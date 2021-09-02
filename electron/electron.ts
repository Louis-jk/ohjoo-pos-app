import { app, BrowserWindow, Menu, ipcMain, Notification} from 'electron';
import * as path from 'path';
const fs = require('fs');
const os = require('os');
const url = require('url');
const { setup: setupPushReceiver } = require('electron-push-receiver');

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
    mainWindow = new BrowserWindow({
      titleBarStyle: 'customButtonsOnHover',
      roundedCorners: false,
      vibrancy: 'fullscreen-ui',
      transparent: true,
      frame: false,
      resizable: false,
      autoHideMenuBar: true,
      width: 1024,
      height: 768,
      backgroundColor: '#2e2c29',
      kiosk: false, // 키오스크 모드(실행시 전체 화면 fixed)
      center: true,
      title: '오늘의주문',
      icon: path.join(app.getAppPath(), '/build/icons/png/64x64.png'),
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true, 
        enableRemoteModule: true, 
        preload: path.join(app.getAppPath(), '/preload.js'),
      }
    });

    let indexPath;
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(app.getAppPath(), '/index.html'),
      slashes: true
    })
    mainWindow.loadURL( indexPath );
    setupPushReceiver(mainWindow.webContents);
    
    // 기본 메뉴 숨기기
    mainWindow.setMenuBarVisibility(false);

    // 개발자 툴 오픈
    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// 브라우저 메뉴창 없애기
Menu.setApplicationMenu(null);

ipcMain.on('window-close', (event, data) => {
  app.quit();
})

// 프린트 정보 열기
ipcMain.on('openPrint', (event, data) => {
  const printerInfo = mainWindow.webContents.getPrinters();
  console.log('printerInfo ??', printerInfo);
  event.sender.send('printInfo', printerInfo);
})

// 메인프로세서 종료
ipcMain.on('closeWindow', (event, data) => {
  mainWindow = null;
  if (process.platform !== 'darwin') {
    app.quit();
  }
 });

// 프린트 PDF 출력 테스트
ipcMain.on('print_pdf', (event, data) => {
  console.log('event >>',event);
  console.log('data >>',data);
  mainWindow.webContents.printToPDF({
    marginsType: 0,
    printBackground: false,
    printSelectionOnly: false,
    landscape: false,
    pageSize: 'A4',
    scaleFactor: 100,
  }).then(data => {
    const pdfPath = path.join(os.homedir(), 'Desktop', 'temp.pdf')
    fs.writeFile(pdfPath, data, (error: any) => {
      if (error) throw error
      console.log(`Wrote PDF successfully to ${pdfPath}`)
    })
  }).catch(error => {
    console.log(`Failed to write PDF to : `, error)
  })
});

// 프린트 출력 테스트
ipcMain.on('print', (event, data) => {
    console.log("print on message!");
    console.log("print data:: ", data);
    mainWindow.webContents.print({
      silent: true, // silent true일 경우 기본프린터로 출력 
      margins: {
        marginType: 'custom',
        top: 0,
        bottom: 100
      },
      printBackground: false,
      color: false,
      landscape: false,
      pagesPerSheet: 1,
      pageRanges: [
        {
          from: 0,
          to: 0
        }
      ],
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