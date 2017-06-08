const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const ipc = require('ipc')

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

app.on('ready', createWindow)

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
