'use strict';

const {dialog} = require('electron').remote;

let dialogOpened = false;

const $directoryPathToSave   = document.getElementById('directoryPathToSave');
const $buttonChooseDirectory = document.getElementById('buttonChooseDirectory');

$buttonChooseDirectory.addEventListener('click', () => {
    if ( dialogOpened ) return;

    dialog.showOpenDialog({
        title: 'Where should I store your backup? Please, specify the directory.',
        properties: ['openDirectory']
    }).then(result => {
        dialogOpened = false;

        console.log(result.canceled);
        console.log(result.filePaths);

        if ( !result.canceled && Array.isArray(result.filePaths) ) {
            $directoryPathToSave.value = result.filePaths[0];
        }
    }).catch(error => {
        dialogOpened = false;

        console.log(error);
    });

    dialogOpened = true;
});
