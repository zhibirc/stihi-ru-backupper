/**
 * @author Yaroslav Surilov <>
 */

'use strict';

const fs      = require('fs');
const path    = require('path');
const http    = require('http');
const cheerio = require('cheerio');

const DIRECTORY_NAME = 'backups';
const FILE_NAME      = `stihi-ru-backup_${new Date().toISOString().slice(0, 10)}.txt`;

const TARGET_URL = 'https://stihi.ru/';

const ACCOUNT = process.argv[2];

const backupsPath = path.join(__dirname, DIRECTORY_NAME, FILE_NAME);

let content = '';

// todo: implement parsing
// var $ = cheerio.load(htmlFile, {ignoreWhitespace:false, xmlMode:false});

fs.writeFile(backupsPath, content, 'utf8', error => {
    if ( error ) {
        return console.log(`Something went wrong during created your backup.\n${error.message}`);
    }

    console.log('Your backup is created successfully!');
});
