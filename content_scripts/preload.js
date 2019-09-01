
const { ipcRenderer } = require('electron')


document.addEventListener('DOMContentLoaded', () => {

    const playPauseBtn = document.getElementsByClassName('player-controls__btn_play')[0]
    const nextTrackBtn = document.getElementsByClassName('player-controls__btn_next')[0]
    const prevTrackBtn = document.getElementsByClassName('player-controls__btn_prev')[0]

    ipcRenderer.on('media-key-down', (event, mediaKey) => {

        if (mediaKey.playPause)
            playPauseBtn.click()

        else if (mediaKey.nextTrack)
            nextTrackBtn.click()
            
        else if (mediaKey.prevTrack)
            prevTrackBtn.click()

    })

})


