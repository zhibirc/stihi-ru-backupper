/**
 * @author Yaroslav Surilov <>
 */

'use strict';

const fs   = require('fs');
const path = require('path');

/** @see {@link https://www.npmjs.com/package/windows-1251} */
const windows1251 = require('windows-1251');

/** @see {@link https://www.npmjs.com/package/got} */
const got = require('got');

/** @see {@link https://www.npmjs.com/package/cheerio} */
const cheerio = require('cheerio');

const composer = new (require('./src/composer'));

const DIRECTORY_NAME = 'backups';
const FILE_NAME      = `stihi-ru-backup_${new Date().toISOString().slice(0, 10)}.txt`;
const BASE_URL       = 'https://stihi.ru';
const ACCOUNT        = process.argv[2] || (() => {
    console.log('You must to pass account name as an argument!');
    process.exit(1);
})();

const pageUrl      = `${BASE_URL}/avtor/${ACCOUNT}`;
const backupsPath  = path.join(__dirname, DIRECTORY_NAME, FILE_NAME);
const poemSelector = '.poemlink';

let poemLinks = [];

let $;

(async () => {
    try {
        const response = await load(pageUrl);
        const responseDecoded = windows1251.decode(response.toString('binary'));

        let amount = responseDecoded.replace(/^[\S\s]*Произведений: <b>(\d+)[\S\s]*$/, '$1');

        parse(responseDecoded);
        composer.setTitle($('h1').text(), ACCOUNT, pageUrl, amount);

        amount = ~~(amount / 50);

        for ( let index = 1; index <= amount; index += 1 ) {
            parse(await load(`${pageUrl}&s=${index * 50}`));
        }

        writeFile(composer.getResult());
    } catch ( error ) {
        console.log(error.response);
    }
})();


async function load ( url ) {
    return got(url, {
        // need only body content
        resolveBodyOnly: true,
        responseType:    'buffer'
    });
}


function parse ( data ) {
    $ = cheerio.load(data);

    $(poemSelector).each((index, element) => {
        poemLinks.push(BASE_URL + $(element).attr('href'));
    });
}


function writeFile ( content ) {
    fs.writeFile(backupsPath, content, 'utf8', error => {
        if ( error ) {
            return console.log(`Something went wrong during created your backup.\n${error.message}`);
        }

        console.log('Your backup is created successfully!');
    });
}
