const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  allowAvatar: (url) => ipcRenderer.send('allow-avatar', url),
});
