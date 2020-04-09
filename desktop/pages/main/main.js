'use strict';

const {dialog} = require('electron').remote;

dialog.showOpenDialog({
    title: 'Where should I store your backup? Please, specify the directory.',
    properties: ['openDirectory']
}).then(result => {
    console.log(result.canceled)
    console.log(result.filePaths)
}).catch(err => {
    console.log(err)
});
