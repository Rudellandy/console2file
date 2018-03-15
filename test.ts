import logger from './index';

logger({
    labels: true,
    timestamp: true,
    fileOnly: true
});

console.log('Yay!', ':D');

console.info('Hey, you!', 'I\'m still here!');

console.error('Whoops! Something went wrong.');

console.warn('Warning!', 'This is test alert.');

console.trace(['this', 'is', 'awesome']);

console.debug({
    'this': 'is',
    such: 'easy'
});