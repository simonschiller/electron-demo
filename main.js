const electron = require('electron')
const {app, BrowserWindow, Menu, ipcMain} = electron
const path = require('path')
const url = require('url')

// Template for the Menu
menuTemplate = [
  {
    label: 'Application',
    submenu: [
      {
        label: 'About',
        click: () => {
          openAboutWindow()
        }
      }
    ]
  }
]

// Keep a global reference so the garbage collector does not destroy our app
let mainWindow
let editWindow

function createWindow () {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720
  })

  // Load the index.html file
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Set up the menu
  var menu = Menu.buildFromTemplate(menuTemplate)
  mainWindow.setMenu(menu)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Opens the about window
function openAboutWindow() {

  let aboutWindow = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    show: false,
    width: 400,
    height: 200
  })
  aboutWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'about.html'),
    protocol: 'file:',
    slashes: true
  }))
  aboutWindow.setMenu(null)
  aboutWindow.once('ready-to-show', () => {
    aboutWindow.show()
  })
}

// Opens the edit window
function openEditWindow(id) {

  editWindow = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    show: false,
    width: 600,
    height: 300
  })
  editWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'edit.html'),
    protocol: 'file:',
    slashes: true
  }))
  editWindow.setMenu(null)
  editWindow.once('ready-to-show', () => {
    editWindow.show()
    editWindow.webContents.send('id', id)
  })
}

// Add a callback event for the update complete event
ipcMain.on('update-complete', (event, arg) => {

  // Close the window
  editWindow.close()

  // Send the update event to the main window
  mainWindow.webContents.send('update-table', '')
})

// Add a callback event for the open edit window event
ipcMain.on('open-edit-window', (event, arg) => {
  openEditWindow(arg);
})

// Create the window then the app is ready
app.on('ready', () => {
  createWindow()

  // Minimizes the app when the power is plugged out
  electron.powerMonitor.on('on-ac', () => {
    mainWindow.restore()
  })
  electron.powerMonitor.on('on-battery', () => {
    mainWindow.minimize()
  })
})

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Reopen the app on macOS
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
