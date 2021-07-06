#!/usr/bin/env node

/**
 * CLI application entry point.
 *
 * @author Yaroslav Surilov <zhibirc.echo@gmail.com>
 */

'use strict';

/** @see {@link https://www.npmjs.com/package/commander} */
const commander = require('commander');
const App = require('../lib/app');

commander
    .version(require('../package.json').version)
    .usage('[options] <account name>')
    .option('-r, --reverse-order', 'sort the poems in date ascending order')
    .option('-c, --compress', 'compress the resulting file')
    .option('-a, --analyze', 'analyze the resulting file and report potential problems')
    .parse(process.argv);

const accountName = commander.args.pop();

if ( !accountName ) {
    return commander.help();
}

const app = new App({
    accountName:  accountName.trim(),
    reverseOrder: commander.reverseOrder,
    analyze:      commander.analyze
});

app.isAccountPresent()
    .then(async () => await app.startScan())
    .catch(() => commander.help());

['SIGINT', 'SIGTERM'].forEach(signal => process.on(signal, process.exit));

process.on('uncaughtException', error => {
    process.exit(1);
});

console.log('Please, wait...');
