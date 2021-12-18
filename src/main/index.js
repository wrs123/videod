import { app, BrowserWindow,ipcMain} from 'electron'
import '../renderer/store'
import VideoDownload from './videoDownload'


// app.commandLine.appendSwitch('proxy-server', 'http://127.0.0.1:7890');

// app.whenReady().then(() => {
//   // 在这里写入你的代码
// })

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      nodeIntegration: true,
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  
}

  



app.on('ready', createWindow)

// mainWindow.webContents.session.setProxy({
//   proxyRules: '127.0.0.1:7890'
// }, function (data) {
//   console.log('代理设置完毕')
//   mainWindow.loadURL(winURL)
// })


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})


ipcMain.on('do',  (e,v)=>{
  mainWindow.webContents.session.setProxy({
    proxyRules: "127.0.0.1:7890"
  }, async function (data) {
    let video = new VideoDownload()
    e.sender.send('re_do', await video.download(v))
})
})

// 设置代理
// ipcMain.on('set_proxy', (event, arg) => {
//   console.log(arg);
//   var { http_proxy } = arg
//   console.log(http_proxy)
//   mainWindow.webContents.session.setProxy({
//     proxyRules: http_proxy
//   }, function (data) {
//     console.log('代理设置完毕')
//     videoDownload.download(v)
// })
// })

// 去掉代理
ipcMain.on('remove_proxy', (event, arg) => {
  win.webContents.session.setProxy({});
})


/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
