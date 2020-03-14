'use strict';

const patters = {
   abnormalSequences: /([^\W\d_])\1{2,}| {2,}|\s{3,}|[!?.]{4,}|[:;,-]{2,}/g
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
