import { app, shell, BrowserWindow, ipcMain, BrowserView } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

const width = 1400;
const height = 800;

export type Tab = {
  id: string;
  title: string;
  url: string;
}

const tabs: Tab[] = [
  { id: "alsdkfj", title: "Google", url: "https://google.com" },
  { id: "alskjdf", title: "Instagram", url: "https://instagram.com" },
  { id: "1u123", title: "Youtube", url: "https://youtube.com" },
]

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width,
    height,
    transparent: true,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })


  const browserView = new BrowserView({
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.setBrowserView(browserView)
  browserView.setBounds({ x: 100, y: 0, width, height })
  browserView.setAutoResize({ width: true, height: true })

  browserView.webContents.loadURL('https://dennishomepage.netlify.app')

  mainWindow.webContents.send('tab-list', tabs)
  ipcMain.on('resize-browserview', (_, { x, y, width, height }) => {
    // Resize the BrowserView
    browserView.setBounds({ width, height, x, y });
  });

  ipcMain.on('open-dev-tools', () => {
    browserView.webContents.openDevTools()
    mainWindow.webContents.send('data', { message: 'Hello from the main process!' })
  });

  ipcMain.on('close-dev-tools', () => {
    browserView.webContents.closeDevTools()
  });

  ipcMain.on('new-tab', (_, { title, url }) => {
    tabs.push({ id: "iasdfl", title, url })
    mainWindow.webContents.send('tab-list', tabs)
  });

  // ipcMain.on('unload-browser-view', () => {
  //   browserView.webContents.close()
  // });

  let oldWebContentUrl;

  ipcMain.on('unload-browser-view', () => {
    oldWebContentUrl = browserView.webContents.getURL();
    console.log(oldWebContentUrl)
    browserView.webContents.close()
    // browserView.webContents = null;
  });

  ipcMain.on('load-browser-view', () => {
    console.log(oldWebContentUrl)
    browserView.webContents.loadURL('https://dennishomepage.netlify.app')
  });


  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })


  createWindow()

  app.on('activate', function() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
