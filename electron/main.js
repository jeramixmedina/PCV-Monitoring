const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { initDatabase, dbApi } = require('../src/js/services/db');

function createWindow() {
  const win = new BrowserWindow({
    width: 1366,
    height: 860,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.loadFile(path.join(__dirname, '../src/index.html'));
}

app.whenReady().then(async () => {
  await initDatabase(path.join(__dirname, '../database/pettycash.db'));
  createWindow();
  app.on('activate', () => BrowserWindow.getAllWindows().length === 0 && createWindow());
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

ipcMain.handle('db:query', async (_e, method, ...args) => dbApi[method](...args));
ipcMain.handle('backup:create', async () => {
  const source = path.join(__dirname, '../database/pettycash.db');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const target = path.join(__dirname, `../backups/pettycash-${stamp}.db`);
  fs.copyFileSync(source, target);
  return target;
});
ipcMain.handle('backup:restore', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openFile'] });
  if (canceled) return null;
  fs.copyFileSync(filePaths[0], path.join(__dirname, '../database/pettycash.db'));
  return filePaths[0];
});
