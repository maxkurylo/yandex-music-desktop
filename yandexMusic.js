
const { BrowserWindow } = require('electron')

const Menu = require('./menu')
const Proxy = require('./proxy')
const KeyEvents = require('./keyEvents')



module.exports = class YandexMusic {

    constructor() {

        this.mainWindowPreferences = {
            width: 1280,
            height: 800,

            webPreferences: {
                nodeIntegration: false,
                preload: __dirname + '/content_scripts/preload.js'
            }
        }

        this.ymUrl = 'https://music.yandex.ru'
        this.proxy = new Proxy()

    }



    createWindow() {

        this.mainWindow = new BrowserWindow(this.mainWindowPreferences)

        new Menu(this.mainWindow)
        new KeyEvents(this.mainWindow)

        if (this.proxy.proxyData.useProxy) {

            this.setProxy(() => {

                this.mainWindow.loadURL(this.ymUrl)

            })

        }
        else {

            this.mainWindow.loadURL(this.ymUrl)

        }

        //this.mainWindow.webContents.openDevTools()

    }



    setProxy(callback) {

        const settings = {
            proxyRules: this.proxy.proxyData.proxyServer
        }

        this.mainWindow.webContents.session.setProxy(settings, callback)

    }


}