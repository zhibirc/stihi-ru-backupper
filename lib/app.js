/**
 * Main application entry point.
 *
 * @module app
 *
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

const composer = new (require('../lib/composer'));
const progress = new (require('../lib/progress'));
const analyzer = new (require('../lib/analyzer'));
const Sort     = require('../lib/sort');

const DIRECTORY_NAME = 'backups';
const FILE_NAME      = `stihi-ru-backup_${new Date().toISOString().slice(0, 10)}.txt`;
const BASE_URL       = 'https://stihi.ru';
const OFFSET         = 50;

const POEM_URL_SELECTOR        = '.poemlink';
const POEM_TEXT_SELECTOR       = '.text';
const ACCOUNT_PRESENT_SELECTOR = '#textlink';

const backupsPath = path.join(process.cwd(), DIRECTORY_NAME, FILE_NAME);

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

                this.analyze && analyzer.scan(...parsed);
            }

            writeFile(composer.getResult());
            this.analyze && writeFile(analyzer.getResult());
        } catch ( error ) {
            console.log(error.response);
        }
    }
}

/**
 *
 * @param buffer
 * @returns {string}
 */
function decode ( buffer ) {
    return windows1251.decode(buffer.toString('binary'));
}

/**
 *
 * @param url
 * @returns {Promise<*|CancelableRequest<Response<string>>>}
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
 * @returns {(*|jQuery|HTMLElement|CancelableRequest<string>|Promise<string>|string)[]}
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
 *
 * @param content
 */
function writeFile ( content ) {
    fs.writeFile(backupsPath, content, 'utf8', error => {
        if ( error ) {
            return console.log(`Something went wrong during created your backup.\n${error.message}`);
        }

        // todo: move to exit callback
        //console.log('Your backup is created successfully!');
    });
}


module.exports = App;
