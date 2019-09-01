const { ipcMain } = require('electron');

export default class TrackDownloader {
    constructor (mainWindow) {
        this.mainWindow = mainWindow;

        this.ipcMain = ipcMain;

        this.cacheDir = 'cached_tracks';
    }

    setTrackInfoListener() {
        ipcMain.on('track-info', function (event, trackInfo) {
            this.setDownloadListener(trackInfo);
            event.reply('ready-to-download-track', {isReady: true});
        })
    }

    setDownloadListener(trackInfo) {
        const trackName = trackInfo.id + '.' + trackInfo.codec;

        this.mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
            // Set the save path, making Electron not to prompt a save dialog.
            item.setSavePath(this.cacheDir + '/' + trackName);
          
            item.on('updated', (event, state) => {
              if (state === 'interrupted') {
                console.log('Download is interrupted but can be resumed')
              } else if (state === 'progressing') {
                if (item.isPaused()) {
                  console.log('Download is paused')
                } else {
                  console.log(`Received bytes: ${item.getReceivedBytes()}`)
                }
              }
            })
            item.once('done', (event, state) => {
              if (state === 'completed') {
                console.log('Download successfully')
              } else {
                console.log(`Download failed: ${state}`)
              }
            })
          })
    }
}