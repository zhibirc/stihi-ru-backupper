'use strict';

const spinners = {
    dots: {
        frames: [
            '⣾',
            '⣽',
            '⣻',
            '⢿',
            '⡿',
            '⣟',
            '⣯',
            '⣷'
        ],
        delay:  80,
        color: '#0ff'
    },
    line: {
        frames: [
            '--',
            '\\',
            '|',
            '/'
        ],
        delay: 130,
        color: '#0f0'
    },
};

const showCursor = () => process.stdout.write('\x1B[?25h');
const hideCursor = () => process.stdout.write('\x1B[?25l');


class Progress {
    constructor ( options = {} ) {
        this.spinner = process.platform === 'win32' ? spinners.line : (options.type || spinners.dots);

        process.on('exit', showCursor);
    }

    startLoop () {
        let index = 0;

        hideCursor();

        setInterval(() => {
            process.stdout.moveCursor(-this.spinner.frames[0].length - 1, 0);
            process.stdout.write(this.spinner.frames[++index % this.spinner.frames.length] + ' ');
        }, this.spinner.delay);
    }

    startLinear () {
        const size = process.stdout && process.stdout.columns || 80;

        let index = 0;
        let timer;

        hideCursor();

        while ( index++ < size ) process.stdout.write('\u2591');

        process.stdout.moveCursor(0, -1);
        index = 0;

        timer = setInterval(() => {
            index++ < size ? process.stdout.write('\u2588') : clearTimeout(timer);
        }, 100);
    }
}


module.exports = Progress;
