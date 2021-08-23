const { contextBridge, ipcRenderer } = require("electron");

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
});
