"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const fs = require("fs");
var Console2File;
(function (Console2File) {
    /**
     * Save console before override
     * @type {Console}
     * @private
     */
    const _console = Object.assign({}, console);
    /**
     * All console loggers without debug (debug will be used as console.log)
     * @type {string[]}
     * @private
     */
    const _consoleKeys = [
        'log', 'info', 'warn', 'error', 'trace'
    ];
    /**
     * Default options
     * @type {Options}
     * @private
     */
    const _defaults = {
        filePath: './stdout.log',
        fileOnly: true,
        labels: false,
        timestamp: false,
        interpreter: util.inspect
    };
    /**
     * All saved options
     * @type {Options[]}
     * @private
     */
    let _options = [];
    /**
     * Returns options for specified message type
     * @param {string} messageType
     * @returns {Console2File.Options}
     */
    function getOptions(messageType) {
        let options = Object.assign({}, _defaults);
        if (messageType in _options) {
            Object.assign(options, _options[messageType]);
        }
        return options;
    }
    /**
     * Prepare message and return as string
     * @param {string} messageType
     * @param args
     * @returns {string}
     */
    function parse(messageType, args) {
        const options = getOptions(messageType);
        /** Interpreter */
        if (typeof options.interpreter === 'function') {
            for (let index in args) {
                /** Let string be without additional ' ' */
                if (typeof args[index] === 'string') {
                    continue;
                }
                args[index] = options.interpreter(args[index]);
            }
        }
        /** Label */
        if (options.labels) {
            args.unshift(`[${messageType.toUpperCase()}]`);
        }
        /** Timestamp */
        if (options.timestamp) {
            args.unshift(`[${new Date().toLocaleString()}]`);
        }
        return args.join(' ');
    }
    /**
     * Main stdout function
     * @param {string} messageType
     * @returns {StdoutFunction}
     */
    function stdout(messageType) {
        return function (...args) {
            let options = getOptions(messageType);
            let message = parse(messageType, args);
            /** Stdout to console */
            if (!options.fileOnly) {
                if (messageType in _consoleKeys) {
                    _console[messageType](message);
                }
                else {
                    _console.log(message);
                }
            }
            /** Stdout to file */
            if (typeof options.filePath === 'string' && options.filePath.length > 0) {
                fs.appendFileSync(options.filePath, `${message}\n`);
            }
        };
    }
    Console2File.stdout = stdout;
    /**
     * Assign user options to object
     * @param {Options} defaults
     * @param {Options} userDefined
     */
    function assignOptions(defaults, userDefined) {
        for (let optionKey in userDefined) {
            if (defaults.hasOwnProperty(optionKey)) {
                defaults[optionKey] = userDefined[optionKey];
            }
            else {
                throw new Error(`Unknown {Options} parameter '${optionKey}'`);
            }
        }
        return defaults;
    }
    /**
     * Configure logger for specified message types
     * @param {Options | string | string[]} args
     */
    Console2File.config = (...args) => {
        let _types = Object.assign([], _consoleKeys).concat(['debug']);
        let _opts = Object.assign({}, _defaults);
        if (args.length === 0) {
            /** No params - configure default functions with default options */
        }
        else if (args.length === 1) {
            if (Array.isArray(args[0])) {
                /** Configure user functions with default options */
                _types = args[0];
            }
            else if (typeof args[0] === 'string') {
                /** Configure user function with default options */
                _types = [args[0]];
            }
            else if (typeof args[0] === 'object') {
                /** Configure default functions with user options */
                _opts = assignOptions(_opts, args[0]);
            }
            else {
                throw new Error(`Expected {Options | string | string[]} but got {${typeof args[0]}}`);
            }
        }
        else if (args.length === 2) {
            if (Array.isArray(args[0])) {
                /** Configure user functions */
                _types = args[0];
            }
            else if (typeof args[0] === 'string') {
                /** Configure user function */
                _types = [args[0]];
            }
            else {
                throw new Error(`Expected {string | string[]} but got {${typeof args[0]}}`);
            }
            if (typeof args[1] === 'object') {
                /** Configure with user options */
                _opts = assignOptions(_opts, args[1]);
            }
            else {
                throw new Error(`Expected {Options} but got {${typeof args[1]}}`);
            }
        }
        else {
            throw new Error(`Too much arguments. Expected 0 to 2 but got ${args.length}`);
        }
        /** Assign options to global variable and override console functions */
        for (let type of _types) {
            _options[type] = _opts;
            console[type] = stdout(type);
        }
    };
})(Console2File = exports.Console2File || (exports.Console2File = {}));
exports.c2f = Console2File;
exports.default = Console2File.config;
