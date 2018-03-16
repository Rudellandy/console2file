import {c2f} from './index';

c2f.config({
    labels: true,
    timestamp: true,
    fileOnly: false,
});

c2f.config('rage', {
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