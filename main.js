// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const { dialog, shell, Notification } = require('electron')
const fs = require('fs');
const { execFile } = require("node:child_process");
const pngquant = require("pngquant-bin");

let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1200,
    simpleFullscreen: true,
    darkTheme: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  mainWindow.maximize
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.setProgressBar(0)
  
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });

  ipcMain.on('open-dialog', () => {
    dialog.showOpenDialog({
      properties: [
        'openFile', 'multiSelections'
      ],
      filters: [{
        name: "Images", extensions:['png'] 
      }],
      }, function (files) {
       if (files) {
         console.log("toto")
       }
      }


    ).then(result => {
      var dir = 'C:\\Users\\samyg\\AppData\\Local\\Temp\\0desktop';

      // Check if directory exist and creates it if not
      if (!fs.existsSync(dir)){
        fs.mkdir(dir,{recursive:true}, (err) => {
          if (err) {
            console.error(err);
          }
        });  
      }

      // Compress files
      var newElem = ''.concat(dir,'\\',path.parse(result.filePaths[0]).base);



      var i = 0
      result.filePaths.forEach(e =>{
        newElem = ''.concat(dir,'\\',path.parse(e).base)
        i++
      
        console.log(newElem)
        execFile(pngquant, ['-o', newElem, e], error => {
            console.log(error);
          });
        

        mainWindow.setProgressBar(i/result.filePaths.length)
        // .mainWindow.setProgressBar(  )
      })
      console.log(result.filePaths)
    }).catch(err => {
      console.log(err)
    }).then(

            new Notification({
              title: "Crompress",
              body: "Compress is over",
            }).show()




    )
    shell.openPath('C:\\Users\\samyg\\AppData\\Local\\Temp\\0desktop')
  });

})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

