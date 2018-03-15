import * as util from 'util';
import * as fs from 'fs';

export module Console2File {
    export interface Options {
        filePath?: string;
        fileOnly?: boolean;
        labels?: boolean;
        timestamp?: boolean;
        interpreter?: (...args) => any;
    }

    const _console: Console = Object.assign({}, console);

    let _filePath,
        _fileOnly,
        _labels,
        _timestamp,
        _interpreter;

    function parse(...args): string {
        // Arguments interpretation
        if (typeof _interpreter === 'function') {
            for(let index in args) {
                if (typeof args[index] === 'string') {
                    continue;
                }
                args[index] = _interpreter(args[index]);
            }
        }

        // Add label if set
        if (_labels && this.callerName) {
            args.unshift(`[${this.callerName.toUpperCase()}]`);
        }

        // Add timestamp
        if (_timestamp) {
            args.unshift(`[${new Date().toLocaleString()}]`);
        }

        // Return parsed message as string
        return args.join(' ');
    }

    export function logger(...args): void {
        const stackTrace = (new Error()).stack;

        // Set callerName for parse function - callerName is label
        this.callerName = stackTrace.replace(/^Error\s+/, '')
            .split('\n')[1]
            .replace(/^\s+at (Console|Object)./, '')
            .replace(/ \(.+\)$/, '')
            .replace(/\@.+/, '');

        let message = parse.apply(this, args);

        // Stdout to console
        if (_fileOnly === false) {
            // Exception to stdout debug
            if (this.callerName === 'debug') {
                this.callerName = 'log';
            }

            if(typeof _console[this.callerName] === 'function') {
                _console[this.callerName](message);
            } else {
                _console.log(message);
            }
        }

        // Stdout to file
        if (typeof _filePath === 'string' && _filePath.length > 0) {
            fs.appendFileSync(_filePath, `${message}\n`);
        }
    }

    export function install(options: Options = {}) {
        const {
            filePath = './stdout.log',
            fileOnly = false,
            labels = false,
            timestamp = false,
            interpreter = util.inspect,
        } = options;

        _filePath = filePath;
        _fileOnly = fileOnly;
        _labels = labels;
        _timestamp = timestamp;
        _interpreter = interpreter;

        console.log = function log(...args): void {
            logger.apply(this, args);
        };

        console.info = function info(...args): void {
            logger.apply(this, args);
        };

        console.error = function error(...args): void {
            logger.apply(this, args);
        };

        console.warn = function warn(...args): void {
            logger.apply(this, args);
        };

        console.trace = function trace(...args): void {
            logger.apply(this, args);
        };

        console.debug = function debug(...args): void {
            logger.apply(this, args);
        };
    }
}

export default Console2File.install;