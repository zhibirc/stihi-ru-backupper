'use strict';

const { app, BrowserWindow } = require('electron');

function createWindow () {
    const windowMain = new BrowserWindow({
        width:  800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    windowMain.loadFile('index.html')
}

app.whenReady().then(createWindow);
