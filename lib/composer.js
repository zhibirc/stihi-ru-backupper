'use strict';

const DIVIDER_LENGTH = 80;


class Composer {
    constructor ( config = {} ) {
        this.result = `${'░'.repeat(DIVIDER_LENGTH)}\n`;
    }

    addTitle ( name, nickname, url, amount ) {
        this.result += `Автор:               ${name} (${nickname})\n`;
        this.result += `Ссылка на страницу:  ${url}\n`;
        this.result += `Всего стихотворений: ${amount}\n`;
        this.result += `${'░'.repeat(DIVIDER_LENGTH)}\n`;
    }

    addPoem ( title, text, date ) {
        text = text.trim();

        this.result += `${' '.repeat(Math.abs((/\n/.test(text) ? text.split('\n')[0] : text).length - title.length >> 1))}${title}\n\n`;
        this.result += `${text}\n\n`;
        this.result += `${date.match(/\d.*(?=\/)/)[0]}\n\n`;
        this.result += `${'-'.repeat(DIVIDER_LENGTH)}\n\n`;
    }

    getResult () {
        return this.result;
    }
}


module.exports = Composer;
