const { app, BrowserWindow, Menu, Tray } = require('electron')
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
    win.setMenu(null)
    win.loadFile('index.html')
    win.hide();
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
    appIcon.setToolTip('This is my application.')
    appIcon.setContextMenu(contextMenu)
    createWindow();
  })


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })



// Checking if autoLaunch is enabled, if not then enabling it.
autoLauncher.isEnabled().then(function(isEnabled) {
  if (isEnabled) return;
   autoLauncher.enable();
}).catch(function (err) {
  throw err;
});

