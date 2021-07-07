'use strict';

const util          = require('util');
const yandexSpeller = require('yandex-speller');
const XRegExp       = require('xregexp');

const checkText = util.promisify(yandexSpeller.checkText);

const DIVIDER_LENGTH = 80;

const divider = `${'░'.repeat(DIVIDER_LENGTH)}\n`;

const patterns = {
    /**
     * Detect the following suspicious combinations:
     * - 3 or more repetitive consecutive Latin or Cyrillic letters
     * - 2 or more consecutive spaces
     * - 3 or more consecutive line breaks
     * - 4 or more "!", "?" or "." which is unusual syntax
     * - 2 or more ":", ";", "," or "-"
     */
    abnormalSequences: {
        matcher: /([а-яa-z])\1{2,}| {2,}|\s{3,}|[!?.]{4,}|[:;,-]{2,}/gi,
        errorMessage: ''
    },

    /**
     * Detect words with letters from different alphabets.
     *
     * @example
     * regе<cyrillic "е">xp
     */
    mixedLetters: {
        matcher: /\b(?:[а-я]+(?=[a-z]+)|[a-z]+(?=[а-я]+))[^ ]*\b/gi,
        errorMessage: ''
    },

    /**
     * Declare title with expected structure and syntax.
     */
    title: {
        matcher: XRegExp('^.*(?:\\d|\\pL|[!?]{1,3}|.{3})$'),
        errorMessage: '- проверьте корректность заголовка;'
    }
};


class Analyzer {
    constructor () {
        this.problemsCount = 0;
        this.result = '';
    }

    async scan ( title, text ) {
        if ( title && !patterns.title.matcher.test(title) ) {
            this.result += `${title} | ${patterns.title.errorMessage}`;

            if ( patterns.mixedLetters.matcher.test(title) ) {
                this.result += ` ${patterns.mixedLetters.errorMessage}\n\n`;
            }
        }

        async function parseLine ( line ) {
            if ( patterns.abnormalSequences.matcher.test(line) ) {
                line += ` | ${patterns.abnormalSequences.errorMessage}`;
            } else { // if there are no suspicious stuff
                let parsedText = await checkText(line);

                parsedText = parsedText
                    .map(item => item.s.length ? `${item.word} -> ${item.s.join('/')}?` : false)
                    .filter(Boolean);
                line += parsedText.length ? ` | ${parsedText.join()}` : '';
            }

            return line;
        }

        text = text.split('\n');

        for ( let index = 0; index < text.length; index += 1 ) {
            text[index] = await parseLine(text[index]);
        }

        this.result += text.join('\n') + divider;
    }

    getResult () {
        if ( this.problemsCount > 0 ) {
            this.result = divider + this.result;
        }

        return this.result;
    }
}


module.exports = Analyzer;
