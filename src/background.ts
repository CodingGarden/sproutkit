// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  app, protocol, BrowserWindow, session, shell, ipcMain,
} from 'electron';
import {
  createProtocol,
  /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib';
import path from 'path';

import { allowUrl } from './allowlist';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    closable: true,
    width: 640,
    height: 1080,
    x: 1920 - 640,
    y: 30,
    frame: false,
    hasShadow: false,
    transparent: true,
    titleBarStyle: 'customButtonsOnHover',
    minimizable: false,
    maximizable: false,
    backgroundColor: '#00FFFFFF',
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const avatarUrls = new Set();

  ipcMain.on('allow-avatar', (event, url) => {
    avatarUrls.add(url);
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL(`file://${__dirname}/index.html`);
  }

  win.on('closed', () => {
    win = null;
  });

  if (session.defaultSession) {
    const filter = {
      urls: ['*://*/*'],
    };
    session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {
      if (avatarUrls.has(details.url) || allowUrl(details.url)) return callback({});
      console.log('blocked', details.url);
      return callback({
        redirectURL: 'https://i.giphy.com/media/xUPGcl3ijl0vAEyIDK/giphy.webp',
      });
    });
    session.defaultSession.webRequest.onHeadersReceived(filter, (details, callback) => {
      if (details.statusCode >= 400) {
        console.log('not found', details.url);
        return callback({
          statusLine: '302 Found',
          responseHeaders: [
            'Location: https://i.giphy.com/media/xUPGcl3ijl0vAEyIDK/giphy.webp',
          ],
        });
      }
      return callback({});
    });
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

app.on('web-contents-created', (e, contents) => {
  contents.on('will-navigate', (event, url) => {
    event.preventDefault();
    shell.openExternal(`https://link-me.now.sh/?url=${encodeURIComponent(url)}`);
  });
  contents.on('new-window', async (event, url) => {
    event.preventDefault();
    console.log('blocked window:', url);
  });
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
