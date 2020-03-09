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
    }

    start () {
        let index = 0;

        hideCursor();

        setInterval(() => {
            process.stdout.moveCursor(-this.spinner.frames[0].length - 1, 0);
            process.stdout.write(this.spinner.frames[++index % this.spinner.frames.length] + ' ');
        }, this.spinner.delay);

        process.on('exit', showCursor);
    }
}


module.exports = Progress;
