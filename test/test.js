"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
lib_1.c2f.config({
    labels: true,
    timestamp: true,
    fileOnly: false,
});
lib_1.c2f.config('rage', {
    labels: true,
    filePath: './rage.log',
    fileOnly: false
});
console.log('Testing started');
console.info('Hey, you!', 'I\'m still here!');
console.error('Whoops! Something went wrong.');
console.warn('Warning!', 'This is test alert.');
console.trace(['this', 'is', 'awesome']);
console.debug({
    'this': 'is',
    such: 'easy'
});
console.rage('quit');
console._origin.log('Old, not modified console.log');
