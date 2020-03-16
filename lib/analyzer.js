'use strict';

const patters = {
    /**
     * - 3 or more repetitive consecutive letters latin or cyrillic letters
     * - 2 or more consecutive spaces
     * - 3 or more consecutive line breaks
     * - 4 or more "!", "?" or "." which is unusual syntax
     * - 2 or more ":", ";", "," or "-"
     */
    abnormalSequences: /([а-яa-z])\1{2,}| {2,}|\s{3,}|[!?.]{4,}|[:;,-]{2,}/gi
};


class Analyzer {
    constructor ( config = {} ) {
        this.result = '';
    }

    scan ( data ) {}

    getResult () {
        return this.result;
    }
}


module.exports = Analyzer;
