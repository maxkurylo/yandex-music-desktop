
const { app } = require('electron')
const YandexMusic = require('./yandexMusic')


app.on('ready', () => {

    ym = new YandexMusic()
    ym.createWindow()

})
