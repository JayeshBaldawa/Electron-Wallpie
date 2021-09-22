const { app, BrowserWindow, Menu, Tray } = require('electron')
const os = require("os");
const fs = require('fs');
const {ipcMain} = require('electron')

const tempDir = os.tmpdir();
const path = require('path')
var AutoLaunch = require('auto-launch');
var autoLauncher = new AutoLaunch({
    name: "Wallpie"
});


var IMG = '/assets/';
var win;
let iconPath = path.join(__dirname, IMG, 'window.png');
let appIcon = null;

function createWindow () {
    win = new BrowserWindow({
        width: 600,
        height: 500,
        icon: path.join(__dirname, IMG, 'window.png'),
        title: 'Wallpie',
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
      },
      resizable : false
      });
    
    win.setTitle('Wallpie')
    try {
    if(fs.existsSync(tempDir+'//wallpie.json'))
    {
      win.hide();
      win.loadFile('index.html')
    }
    else
    {
      win.loadFile("recommend.html")
    }
    }
    catch(err) {
      console.error(err)
    }
    win.setMenu(null);
    //win.webContents.openDevTools();
  }

app.whenReady().then(() => {
    appIcon = new Tray(iconPath)
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Show',click(){
        win.show();
      }},
      { label: 'Quit',click(){
        app.quit()
      }},
    ])
    appIcon.setToolTip('Wallpie is running in background')
    appIcon.setContextMenu(contextMenu)
    createWindow();
  })


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  ipcMain.on('close-me', (evt, arg) => {
    win.loadFile("index.html");
    win.hide();
  })

  ipcMain.on('close-me-1', (evt, arg) => {
    win.close();
  })


// Checking if autoLaunch is enabled, if not then enabling it.
autoLauncher.isEnabled().then(function(isEnabled) {
  if (isEnabled) return;
   autoLauncher.enable();
}).catch(function (err) {
  throw err;
});

