
const { Menu } = require('electron')



module.exports = class MainMenu {

    constructor(mainWindow) {

        let template = []
        if (process.platform === 'darwin') {
            template.push(this.macMenuItem())
        }
        template.push(this.fileMenuItem(mainWindow))
        template.push(this.editMenuItem())

        const menu = Menu.buildFromTemplate(template)
        Menu.setApplicationMenu(menu)

    }



    macMenuItem() {

        const { app } = require('electron')
        return {
            label: app.getName(),
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        };
    }



    fileMenuItem(mainWindow) {

        return {
            label: "Файл",
            submenu: [
                {
                    label: "Обновить страницу",
                    click() {
                        mainWindow.reload()
                    }
                },
                {
                    label: "Прокси",
                    click() {
                        const ModalWindow = require('./modal_windows/modalWindow')
                        new ModalWindow({
                            width: 350,
                            height: 250,
                            parent: mainWindow
                        }, __dirname + '/modal_windows/proxy')
                    }
                },
                { type: 'separator' },
                {
                    label: "Инструменты разработчика",
                    type: "checkbox",
                    click() {
                        mainWindow.webContents.toggleDevTools()
                    }
                }
            ]
        };
    }



    editMenuItem() {
        return {
            label: 'Изменить',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'pasteandmatchstyle' },
                { role: 'delete' },
                { role: 'selectall' }
            ]
        }
    }



}