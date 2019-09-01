
const { globalShortcut } = require('electron')



module.exports = class KeyEvents {

    constructor(mainWindow) {

        this.mainWindow = mainWindow

        this.nextTrack()
        this.previousTrack()
        this.playPause()

    }



    nextTrack() {

        // on OS X Mojave media keys doesn't work anymore, use functional instead

        this.registerShortcut('F9', () => {

            this.sendMediaKeyEvent({ nextTrack: true })

        })
    }

    playPause() {

        // play/pause media key is supported. Functional key is added as an option

        this.registerShortcut('F8', () => {

            this.sendMediaKeyEvent({ playPause: true })

        })
    }



    previousTrack() {

        // on OS X Mojave media keys doesn't work anymore, use functional instead

        this.registerShortcut('F7', () => {

            this.sendMediaKeyEvent({ prevTrack: true })

        })
    }



    registerShortcut(key, callback) {

        let registration = globalShortcut.register(key, callback)

        if (!registration)
            console.log("Failed to register shortcut for " + key)

    }



    sendMediaKeyEvent(mediaKeys) {

        this.mainWindow.webContents.send('media-key-down', mediaKeys)

    }



}