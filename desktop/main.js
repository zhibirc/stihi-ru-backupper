'use strict';

const path = require('path');
const {app, BrowserWindow, ipcMain} = require('electron');
const metrics = require('./metrics');

const elemon = require('elemon');
const debug  = require('electron-debug');

debug();

app.requestSingleInstanceLock() || app.quit();

app.whenReady().then(async () => {
    const commonOptions = {
        width:  metrics.width,
        height: metrics.height,
        show: false,
        resizable: false,
        icon: path.join(__dirname, 'icon.png'),
        backgroundColor: '#2e2c29',
    };

    const pages = {
        main: (async () => {
            let page = new BrowserWindow({
                ...commonOptions,
                webPreferences: {
                    nodeIntegration: true,
                    preload: path.join(__dirname, 'preload.js')
                }
            });

            page.once('ready-to-show', () => {
                //console.log(document.body.innerHTML);
                page.show();
            });

            page.on('show', () => {});

            page.on('hide', () => {});

            page.on('closed', () => {
                page = null;
            });

            await page.loadFile(path.join(__dirname, './pages/main', 'main.html'));

            // for debug
            page.webContents.openDevTools();

            return page;
        })(),
        settings: (async () => {
            let page = new BrowserWindow({
                ...commonOptions,
                webPreferences: {
                    nodeIntegration: true,
                    preload: path.join(__dirname, 'preload.js')
                }
            });

            page.once('ready-to-show', () => {
                //console.log(document.body.innerHTML);
                page.show();
            });

            page.on('show', () => {});

            page.on('hide', () => {});

            page.on('closed', () => {
                page = null;
            });

            await page.loadFile(path.join(__dirname, './pages/settings', 'settings.html'));

            // for debug
            page.webContents.openDevTools();

            return page;
        })(),
        help: (async () => {
            let page = new BrowserWindow({
                ...commonOptions,
                webPreferences: {
                    nodeIntegration: true,
                    preload: path.join(__dirname, 'preload.js')
                }
            });

            page.once('ready-to-show', () => {
                //console.log(document.body.innerHTML);
                page.show();
            });

            page.on('show', () => {});

            page.on('hide', () => {});

            page.on('closed', () => {
                page = null;
            });

            await page.loadFile(path.join(__dirname, './pages/help', 'help.html'));

            // for debug
            page.webContents.openDevTools();

            return page;
        })()
    };

    elemon({
        app: app,
        mainFile: 'main.js',
        bws: [
            {bw: pages.main, res: [/* watch all files in dir, reload on any changes */]},
            {bw: pages.settings, res: [/* watch all files in dir, reload on any changes */]},
        ]
    })
});

app.on('window-all-closed', () => {
    process.platform === 'darwin' || app.quit();
});

app.on('activate', () => {
    BrowserWindow.getAllWindows().length || app.emit('ready');
});

process.on('uncaughtException', (error = {}) => {
    error.message && console.error(error.message);
    error.stack && console.info(error.stack);
});

process.on('unhandledRejection', (error = {}) => {
    error.message && console.error(error.message);
    error.stack && console.info(error.stack);
});
