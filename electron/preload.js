const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  db: (method, ...args) => ipcRenderer.invoke('db:query', method, ...args),
  createBackup: () => ipcRenderer.invoke('backup:create'),
  restoreBackup: () => ipcRenderer.invoke('backup:restore')
});
