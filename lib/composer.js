'use strict';

class Composer {
    constructor ( config = {} ) {
        this.result = '';
    }

    addTitle ( name, nickname, url, amount ) {
        this.result += `Автор: ${name} (${nickname})\n`;
        this.result += `Ссылка на страницу: ${url}\n`;
        this.result += `Всего стихотворений: ${amount}\n\n`;
    }

    addPoem ( title, text ) {
        this.result += `--- ${title} ---\n`;
        this.result += `${text}\n\n`;
    }

    getResult () {
        return this.result;
    }
}


module.exports = Composer;
