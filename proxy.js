
const fs = require('fs')
const { ipcMain, app } = require('electron')



module.exports = class Proxy {

    constructor() {

        this.defaultProxy = {
            useProxy: true,
            proxyServer: "91.208.39.70:8080"
        }

        this.proxyFilePath = app.getPath('userData') + '/proxyData.json'
        this.proxyData = this.readProxyDataSync()

        this.setIPCMain()
    }




    setIPCMain() {

        ipcMain.on('get-proxy-data', (event, arg) => {

            event.reply('get-proxy-data-reply', this.proxyData)

        })

        ipcMain.on('set-proxy-data', (event, recievedProxyData) => {

            // if proxy data has changed, update file
            if (recievedProxyData && (recievedProxyData.proxyServer !== this.proxyData.proxyServer || recievedProxyData.useProxy !== this.proxyData.useProxy))
                this.writeProxyDataSync(recievedProxyData)

        })

    }



    readProxyDataSync() {

        try {

            fs.accessSync(this.proxyFilePath)
            try {

                const rawData = fs.readFileSync(this.proxyFilePath)
                const jsonData = JSON.parse(rawData)

                return jsonData

            }
            catch (err) {

                console.log(err)

            }

        }

        catch (fileExsistsError) {

            //if file is not exsists, create a new one
            this.writeProxyDataSync(this.defaultProxy)

        }

        return this.defaultProxy

    }



    writeProxyDataSync(proxyData) {

        try {

            const data = JSON.stringify(proxyData)
            fs.writeFileSync(this.proxyFilePath, data)

            this.proxyData = proxyData

        }

        catch (error) {

            console.log(error)

        }

    }



}