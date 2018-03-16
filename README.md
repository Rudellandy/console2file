## Console2File
### Node module that allows you to log your console into file (and much more)

## Note
Default `console.log`, `console.error`, etc. are overridden by this module to stay with familiar functions

## Table of Contents
* [Installation](#installation)
* [Usage](#usage)
* [Parameters](#parameters)
* [License](#license)

## Installation
```bash
npm install --save console2file
```
or (preferred)
```bash
yarn add console2file
```

## Usage
```javascript
var c2f = require('console2file').default;
// or
import c2f from 'console2file';

c2f({
    fileOnly: false,
    labels: true
}); // Overrides default console loggers (and debug)

c2f('rage', {
    labels: true
}); // Creates new function with default options

console.info('Hurray!'); // logs '[INFO] Hurray!' to file ./stdout.log and console

console.rage('quit'); // logs '[RAGE] quit' only to file ./stdout.log
```
or
```javascript
var c2f = require('console2file');
// or
import {c2f} from 'console2file';

c2f.config({
    fileOnly: false,
    labels: true
}); // Overrides default console loggers (and debug)

c2f.config('rage', {
    labels: true
}); // Creates new function with default options

console.info('Hurray!'); // logs '[INFO] Hurray!' to file ./stdout.log and console

console.rage('quit'); // logs '[RAGE] quit' only to file ./stdout.log
```

## Parameters
Parameter   | Default value    | Description
----------- | ---------------- | ---
filePath    | `'./stdout.log'` | File path to log your console (set empty string or not string to disable)
fileOnly    | `true`           | Log only to file or both (file and console)
labels      | `false`          | Display labels (i.e. `[LOG]`, `[ERROR]`, ...)
timestamp   | `false`          | Display timestamp (i.e. `[2018-3-16 00:42:29]`)
interpreter | `util.inspect`   | Interpretation of non string values (allows to log full objects not as `[Object object]` etc.)

## License
MIT