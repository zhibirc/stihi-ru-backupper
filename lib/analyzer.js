'use strict';

const patterns = {
    /**
     * Detect the following suspicious combinations:
     * - 3 or more repetitive consecutive Latin or Cyrillic letters
     * - 2 or more consecutive spaces
     * - 3 or more consecutive line breaks
     * - 4 or more "!", "?" or "." which is unusual syntax
     * - 2 or more ":", ";", "," or "-"
     */
    abnormalSequences: /([а-яa-z])\1{2,}| {2,}|\s{3,}|[!?.]{4,}|[:;,-]{2,}/gi,

    /**
     * Detect words with letters from different alphabets.
     *
     * @example
     * regе<cyrillic "е">xp
     */
    mixedLetters: /\b(?:[а-я]+(?=[a-z]+)|[a-z]+(?=[а-я]+))[^ ]*\b/gi,

    /**
     * Declare title with expected structure and syntax.
     *
     * @example
     * title (a capital letter is expected at the beginning)
     * title. (only a few marks are expected at the end: ?, !, ..., not a dot)
     */
    properTitle: /^[А-ЯA-Z][А-Яа-яA-Za-z]*(?:[!?]{0,3}|.{3})$/
};


class Analyzer {
    constructor () {
        this.result = '';
    }

    scan ( title, text ) {

    }

    getResult () {
        return this.result;
    }
}


module.exports = Analyzer;
