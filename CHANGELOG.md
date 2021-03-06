## v1.1.6
* Added moment.js for timestamp usage

## v1.1.5
* Added TSLint to project - standardized code

## v1.1.4
* Added _origin property to allow user access to not modified console (`console._origin.log('Not modified log function')`)

## v1.1.3
* Bump version to fix npm

## v1.1.2
* Moved index files to ./lib and test files to ./test
* Added stackTrace to console.trace
* All functions are now using default console.log (not themselves like previous)

## v1.1.1
* Removed unnecessary dependencies
* Added devDependencies (for TypeScript)
* Added build script (npm run build)

## v1.1.0
* Added comments to module (code is more clearly)
* Changed default `install` function to `config`
* Init function (`config`) can be used in 3 different ways *(without, one or two params)*
* `config` function now can create new functions in `{Console}` *(with 1st param as `{string, string[]}`. i.e. `c2f.config('rage');` will create console.rage)*
* Label is not generated every stdout with ugly error stack trace method. Now is set on init function
* Options are now per function
* Script throws error on wrong init

## v1.0.0
* Release of this awesome module! :D