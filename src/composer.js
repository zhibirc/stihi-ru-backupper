'use strict';

class Composer {
    constructor ( config = {} ) {
        this.result = '';
    }

    setTitle ( name, nickname, url, amount ) {
        this.result += `Автор: ${name} (${nickname})\n`;
        this.result += `Ссылка на страницу: ${url}\n`;
        this.result += `Всего стихотворений: ${amount}\n\n`;
    }

    getResult () {
        return this.result;
    }
}


module.exports = Composer;
