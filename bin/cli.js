/**
 * @author Yaroslav Surilov <>
 *
 * @license MIT
 */

'use strict';

/** @see {@link https://www.npmjs.com/package/commander} */
const commander = require('commander');

const App = require('../lib/app');

commander
    .version(require('../package.json').version)
    .usage('[options] <account name>')
    .option('-r, --reverse-order', 'sort the poems in date descending order')
    .parse(process.argv);

const app = new App({
    accountName:  commander.args.pop(),
    reverseOrder: commander.reverseOrder
});

app.isAccountPresent()
    .then(async () => await app.startScan())
    .catch(console.error);

//process.on('exit', wamp.call.bind(wamp, 'controlPointDisconnect'));

//['SIGINT', 'SIGTERM'].forEach(signal => process.on(signal, process.exit));

process.on('uncaughtException', error => {
    process.exit(1);
});

console.log('Please, wait...');