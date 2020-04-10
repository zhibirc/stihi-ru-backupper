'use strict';

const path                 = require('path');
const {app, BrowserWindow} = require('electron');
const debug                = require('electron-debug');

const metrics = require('./metrics');

require('electron-reload')(__dirname);

// this way is for hard resetting instead of Web Contents reset only as in above
/*require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});*/

debug();

app.requestSingleInstanceLock() || app.quit();

app.whenReady().then(async () => {
    const commonOptions = {
        width:  metrics.width,
        height: metrics.height,
        show: false,
        resizable: false,
        icon: path.join(__dirname, metrics.icon),
        backgroundColor: metrics.background
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
            //page.webContents.openDevTools();

            return page;
        })(),
/*        settings: (async () => {
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
        })()*/
    };
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
