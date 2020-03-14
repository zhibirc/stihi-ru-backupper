'use strict';

const ASCENDING_ORDER  = Symbol('ASCENDING_ORDER');
const DESCENDING_ORDER = Symbol('DESCENDING_ORDER');

function sort ( data, order ) {
    // it seems it's the most balanced way of sorting here
    return order === ASCENDING_ORDER ? data.sort() : data.sort().reverse();
}


class Sort {
    constructor ( order = DESCENDING_ORDER ) {
        this.order      = order;
        this.lastResult = null;
    }

    setOrder ( order ) {
        this.order = order;
    }

    getResult ( data = [] ) {
        this.lastResult = sort(data, this.order);

        return this.lastResult;
    }

    static get ASCENDING_ORDER () {
        return ASCENDING_ORDER;
    }

    static get DESCENDING_ORDER () {
        return DESCENDING_ORDER;
    }
}


module.exports = Sort;
