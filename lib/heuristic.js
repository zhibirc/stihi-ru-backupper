'use strict';

const patters = {
   abnormalSequences: /([^\W\d_])\1{2,}| {2,}|\s{3,}|[!?.]{4,}|[:;,-]{2,}/g
};


class Heuristic {
    constructor ( config = {} ) {
    }
}


module.exports = Heuristic;
