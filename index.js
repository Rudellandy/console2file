"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const fs = require("fs");
var Console2File;
(function (Console2File) {
    const _console = Object.assign({}, console);
    let _filePath, _fileOnly, _labels, _timestamp, _interpreter;
    function parse(...args) {
        // Arguments interpretation
        if (typeof _interpreter === 'function') {
            for (let index in args) {
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
    function logger(...args) {
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
            if (typeof _console[this.callerName] === 'function') {
                _console[this.callerName](message);
            }
            else {
                _console.log(message);
            }
        }
        // Stdout to file
        if (typeof _filePath === 'string' && _filePath.length > 0) {
            fs.appendFileSync(_filePath, `${message}\n`);
        }
    }
    Console2File.logger = logger;
    function install(options = {}) {
        const { filePath = './stdout.log', fileOnly = true, labels = false, timestamp = false, interpreter = util.inspect, } = options;
        _filePath = filePath;
        _fileOnly = fileOnly;
        _labels = labels;
        _timestamp = timestamp;
        _interpreter = interpreter;
        console.log = function log(...args) {
            logger.apply(this, args);
        };
        console.info = function info(...args) {
            logger.apply(this, args);
        };
        console.error = function error(...args) {
            logger.apply(this, args);
        };
        console.warn = function warn(...args) {
            logger.apply(this, args);
        };
        console.trace = function trace(...args) {
            logger.apply(this, args);
        };
        console.debug = function debug(...args) {
            logger.apply(this, args);
        };
    }
    Console2File.install = install;
})(Console2File = exports.Console2File || (exports.Console2File = {}));
exports.default = Console2File.install;
