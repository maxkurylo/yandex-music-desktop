
const { BrowserWindow } = require('electron')
const fs = require('fs')



module.exports = class ModalWindow {

    // customPref is Electron prefences for BrowserWindows
    // path should be absolute path to modal window directory
    
    constructor(customPref, path) {

        let pref = {
            modal: true,
            show: false,
            webPreferences: {
                nodeIntegration: true
            },
            ...customPref
        }

        const modalWindow = new BrowserWindow(pref)
        modalWindow.loadURL('file://' + path + '/index.html')

        modalWindow.once('ready-to-show', () => {

            modalWindow.show()
            //modalWindow.webContents.toggleDevTools()

        })

    }

}