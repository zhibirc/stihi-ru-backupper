'use strict';

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
     *
     * @example
     * title (a capital letter is expected at the beginning)
     * title. (only a few marks are expected at the end: ?, !, ..., not a dot)
     */
    title: {
        matcher: /^[А-ЯA-Z][А-Яа-яA-Za-z]*(?:[!?]{0,3}|.{3})$/,
        errorMessage: '- check correctness of title, something in it looks strange;'
    }
};


class Analyzer {
    constructor () {
        this.problemsCount = 0;
        this.result = '';
    }

    scan ( title, text ) {
        if ( title && !patterns.title.matcher.test(title) ) {
            this.result += `${title} | ${patterns.title.errorMessage}`;

            if ( patterns.mixedLetters.matcher.test(title) ) {
                this.result += ` ${patterns.mixedLetters.errorMessage}\n\n`;
            }
        }

        this.result += text
            .split('\n')
            .map(line => {
                if ( patterns.abnormalSequences.matcher.test(line) ) {
                    line += ` | ${patterns.abnormalSequences.errorMessage}`;
                }

                // todo: add spell-checking

                return line;
            })
            .join('\n');

        this.result += divider;
    }

    getResult () {
        if ( this.problemsCount > 0 ) {
            this.result = divider + this.result;
        }

        return this.result;
    }
}


module.exports = Analyzer;
