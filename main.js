const {app, BrowserWindow, ipcRenderer} = require('electron')
const path = require('path')
const url = require('url')
const ipc = require('ipc')
const updater = require('electron-updater').autoUpdater

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    frame: false
  })
  
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app/index.html'),
    protocol: 'file:',
    slashes: true
  }))
  
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

//autoUpdater
updater.autoDownload = false

//autoUpdater event listeners
updater.on('checking-for-update', () => {
	mainWindow.webContents.send('update-check', "Checking for update...")
})
updater.on('update-available', (ev, info) => {
	mainWindow.webContents.send('update-available', "There is an update available. Click the update button to download and install it.")
})
updater.on('update-not-available', (ev, info) => {
	mainWindow.webContents.send('update-none', "Application is up to date.")
})
updater.on('error', (ev, err) => {
	mainWindow.webContents.send('update-error', "Error while checking for update.")
})
updater.on('download-progress', (ev, progress) => {
	mainWindow.webContents.send('download-progress', (progressObj) => {
		let dl_message = "Download speed: " + Math.round(progressObj.bytesPerSecond * 100.0) / 100.0
		dl_message = dl_message + ' - ' + progressObj.transferred + "/" + progressObj.total
		mainWindow.webContents.send('dl-message', dl_message)
	})
})
updater.on('update-downloaded', (ev, info) => {
	updater.quitAndInstall()
})


app.on('ready', () => {
	updater.on('ready', createWindow)
	
	updater.checkForUpdates()
	
	//If the user clicked the Download & Install button
	ipc.on('app-update', () => {
		updater.downloadUpdate()
	})
})

//Kill the app if all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
//Kill the app if the close window button is clicked
ipc.on('close-window', () => {
	app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
