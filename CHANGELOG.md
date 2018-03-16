## v1.0.1
* Added comments to module (code is more clearly)
* Changed default `install` function to `config`
* Init function (`config`) can be used in 3 different ways *(without, one or two params)*
* `config` function now can create new functions in `{Console}` *(with 1st param as `{string, string[]}`. i.e. `c2f.config('rage');` will create console.rage)*
* Label is not generated every stdout with ugly error stack trace method. Now is set on init function
* Options are now per function
* Script throws error on wrong init

## v1.0.0
* Release of this awesome module! :D