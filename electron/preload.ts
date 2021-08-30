const { contextBridge, ipcRenderer, remote } = require("electron");
const { PosPrinter } = remote.require("electron-pos-printer");

contextBridge.exposeInMainWorld("appRuntime", {
  send: (channel: string, data: any) => {
    ipcRenderer.send(channel, data);
  },
  on: (channel: string, data: any) => {
    ipcRenderer.on(channel, data);
  },
  subscribe: (channel: string, listener: any) => {
    const subscription = (event: any, ...args: any) => listener(...args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
  printer: (channel: string, data: any) => {
    ipcRenderer.send(channel, data);
  },
  printer01: (data: any[], options: any) => new Promise((res: Function, fail: Function) => {
    PosPrinter.print(data, options);
  }).then(() => {}).catch(err => console.log(err))
});