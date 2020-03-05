/**
 * @author Yaroslav Surilov <>
 */

'use strict';

const fs          = require('fs');
const path        = require('path');

/** @see {@link https://www.npmjs.com/package/windows-1251} */
const windows1251 = require('windows-1251');

/** @see {@link https://www.npmjs.com/package/got} */
const got         = require('got');

/** @see {@link https://www.npmjs.com/package/cheerio} */
const cheerio     = require('cheerio');

const DIRECTORY_NAME = 'backups';
const FILE_NAME      = `stihi-ru-backup_${new Date().toISOString().slice(0, 10)}.txt`;

const TARGET_URL = 'https://stihi.ru/avtor/';

const ACCOUNT = process.argv[2] || (() => {
    console.log('You must to pass account name as an argument!');
    process.exit(1);
})();

const backupsPath = path.join(__dirname, DIRECTORY_NAME, FILE_NAME);

let poemLinks = [];
let content   = '';

// todo: implement parsing
// var $ = cheerio.load(htmlFile, {ignoreWhitespace:false, xmlMode:false});

(async () => {
    try {
        const response = await got(TARGET_URL + ACCOUNT, {
            // need only body content
            resolveBodyOnly: true,
            responseType:    'buffer'
        });

        const amount = windows1251.decode(response.toString('binary')).replace(/^[\S\s]*Произведений: <b>(\d+)[\S\s]*$/, '$1');

        content += `Всего ${amount} стихотворени${amount > 4 && amount < 21 || amount % 10 > 4 || amount % 10 === 0 ? 'й' : amount % 10 === 1 ? 'е' : 'я' }.\n\n`;

        writeFile(content);
    } catch ( error ) {
        console.log(error.response.body);
    }
})();

function writeFile ( content ) {
    fs.writeFile(backupsPath, content, 'utf8', error => {
        if ( error ) {
            return console.log(`Something went wrong during created your backup.\n${error.message}`);
        }

        console.log('Your backup is created successfully!');
    });
}
