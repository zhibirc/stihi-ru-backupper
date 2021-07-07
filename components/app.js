/**
 * Main application entry point.
 *
 * @module app
 *
 * @author Yaroslav Surilov <zhibirc.echo@gmail.com>
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

const composer = new (require('./composer'));
const progress = new (require('./progress'));
const analyzer = new (require('./analyzer'));
const Sort     = require('./sort');

const DIRECTORY_NAME = 'backups';
const FILE_NAME      = `stihi-ru-backup_${new Date().toISOString().slice(0, 10)}.txt`;
const ERROR_LOG      = `stihi-ru-error-log_${new Date().toISOString().slice(0, 10)}.txt`;
const BASE_URL       = 'https://stihi.ru';
const OFFSET         = 50;

const POEM_URL_SELECTOR        = '.poemlink';
const POEM_TEXT_SELECTOR       = '.text';
const ACCOUNT_PRESENT_SELECTOR = '#textlink';

const backupsDirectoryPath = path.join(process.cwd(), DIRECTORY_NAME);
const backupsPath  = path.join(backupsDirectoryPath, FILE_NAME);
const errorLogPath = path.join(backupsDirectoryPath, ERROR_LOG);

const cache = new WeakMap();

let poemLinks = [];

let $;

class App {
    constructor ( config = {} ) {
        this.accountName  = config.accountName;
        this.accountUrl   = `${BASE_URL}/avtor/${this.accountName}`;

        this.reverseOrder = config.reverseOrder;
        this.analyze      = config.analyze;
    }

    async isAccountPresent () {
        const response = decode(await load(this.accountUrl));
        const title    = cheerio.load(response)(ACCOUNT_PRESENT_SELECTOR);

        if ( title.length > 0 ) {
            return Boolean(cache.set(this, {response}));
        }

        return false;
    }

    async startScan () {
        progress.startLoop();

        try {
            const response = cache.get(this).response || decode(await load(this.accountUrl));

            let amount = response.replace(/^[\S\s]*Произведений: <b>(\d+)[\S\s]*$/, '$1');

            parse(response);
            composer.addTitle($('h1').text(), this.accountName, this.accountUrl, amount);

            amount = ~~(amount / OFFSET);

            for ( let index = 1; index <= amount; index += 1 ) {
                parse(await load(`${this.accountUrl}&s=${index * OFFSET}`));
            }

            poemLinks = new Sort(this.reverseOrder ? Sort.ASCENDING_ORDER : Sort.DESCENDING_ORDER).getResult(poemLinks);
            amount    = poemLinks.length;

            for ( let index = 0; index < amount; index += 1 ) {
                const response = decode(await load(poemLinks[index]));
                const parsed   = parse(response, true);

                composer.addPoem(...parsed, poemLinks[index]);

                this.analyze && await analyzer.scan(...parsed);
            }

            writeFile(backupsPath, composer.getResult());
            this.analyze && writeFile(errorLogPath, analyzer.getResult());
            // TODO:
            process.exit(0);
        } catch ( error ) {
            console.log(error.response);
        }
    }
}

/**
 *
 * @param buffer
 *
 * @return {string}
 */
function decode ( buffer ) {
    return windows1251.decode(buffer.toString('binary'));
}

/**
 *
 * @param url
 *
 * @return {Promise}
 */
async function load ( url ) {
    return got(url, {
        resolveBodyOnly: true,
        responseType:    'buffer'
    });
}


/**
 *
 * @param data
 * @param isPoem
 *
 * @return {array|undefined}
 */
function parse ( data, isPoem = false ) {
    $ = cheerio.load(data);

    if ( isPoem ) {
        return [
            $('h1').text(),
            $(POEM_TEXT_SELECTOR).text()
        ];
    } else {
        $(POEM_URL_SELECTOR).each((index, element) => {
            poemLinks.push(BASE_URL + $(element).attr('href'));
        });
    }
}


/**
 * Write result files with poems and analytics.
 * First check if backups directory exists and can be accessed.
 *
 * @param {string} path - absolute path for file to write
 * @param {string} content - data from parser
 */
function writeFile ( path, content ) {
    try {
        fs.accessSync(backupsDirectoryPath, fs.constants.W_OK);
    } catch {
        fs.mkdirSync(backupsDirectoryPath);
    }

    try {
        fs.writeFileSync(path, content, 'utf8');

        console.log('Success.');
    } catch ( error ) {
        console.log(`something went wrong: \n${error.message}`);
    }
}


module.exports = App;
