'use strict';

const path = require('path');
const {app, BrowserWindow} = require('electron');
const elemon = require('elemon');
const debug = require('electron-debug');

debug();

let windowMain;

async function createWindow () {
    windowMain = new BrowserWindow({
        width:  800,
        height: 600,
        show: false,
        resizable: false,
        backgroundColor: '#2e2c29',
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    windowMain.once('ready-to-show', () => {
        //console.log(document.body.innerHTML);
        windowMain.show();
    });

    windowMain.on('show', () => {});

    windowMain.on('hide', () => {});

    windowMain.on('closed', () => {
        windowMain = null;
    });

    // if the render process crashes, reload the window
    /*windowMain.webContents.on('crashed', () => {
        windowMain.destroy();
        createWindow();
    });*/

    await windowMain.loadFile(path.join(__dirname, 'index.html'));

    // for debug
    windowMain.webContents.openDevTools();

    return windowMain;
}

app.requestSingleInstanceLock() || app.quit();

app.whenReady().then(async () => {
    await createWindow();

    elemon({
        app: app,
        mainFile: 'main.js',
        bws: [
            {bw: windowMain, res: [/* watch all files in dir, reload on any changes */]}
        ]
    })
});

app.on('window-all-closed', () => {
    process.platform === 'darwin' || app.quit();
});

app.on('activate', () => {
    BrowserWindow.getAllWindows().length || createWindow();
});

process.on('uncaughtException', (error = {}) => {
    error.message && console.error(error.message);
    error.stack && console.info(error.stack);
});

process.on('unhandledRejection', (error = {}) => {
    error.message && console.error(error.message);
    error.stack && console.info(error.stack);
});
