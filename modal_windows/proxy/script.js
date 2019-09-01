'use strict'

const { remote, shell, ipcRenderer } = require('electron')

let proxyData = {}

let input = document.getElementById("proxyServer"),
    a = document.getElementById("proxyList"),
    checkbox = document.getElementById("useProxy"),
    btn = document.getElementById("done")

btn.onclick = function () {
    proxyData.useProxy = checkbox.checked
    if (input.value !== '')
        proxyData.proxyServer = input.value

    ipcRenderer.send('set-proxy-data', proxyData)
    // close modal window
    remote.getCurrentWindow().close()
}

checkbox.onclick = function () {
    a.disabled = !checkbox.checked
    input.disabled = !checkbox.checked
}

a.onclick = function (e) {
    e.preventDefault()
    shell.openExternal('https://hidemy.name/ru/proxy-list/?maxtime=600&type=hs&anon=34#list')
}

ipcRenderer.send('get-proxy-data', 'get proxy data')

ipcRenderer.on('get-proxy-data-reply', (event, recievedProxyData) => {

    console.log(recievedProxyData, new Date().getTime())

    proxyData = recievedProxyData;

    input.value = proxyData.proxyServer
    input.disabled = !proxyData.useProxy
    checkbox.checked = proxyData.useProxy
    a.disabled = !proxyData.useProxy

})

