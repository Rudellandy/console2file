"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const moment = require("moment");
const util = require("util");
var Console2File;
(function (Console2File) {
    /**
     * Save console before override
     * @type {Console}
     * @private
     */
    const _console = Object.assign({}, console);
    /** Assign _origin property to allow access to original console */
    console._origin = _console;
    /**
     * All console loggers without debug (debug will be used as console.log)
     * @type {string[]}
     * @private
     */
    const _consoleKeys = [
        "log", "info", "warn", "error", "trace", "debug",
    ];
    /**
     * Default options
     * @type {IOptions}
     * @private
     */
    const _defaults = {
        fileOnly: true,
        filePath: "./stdout.log",
        interpreter: util.inspect,
        labels: false,
        timestamp: false,
    };
    /**
     * All saved options
     * @type {Options[]}
     * @private
     */
    const _options = [];
    /**
     * Returns options for specified message type
     * @param {string} messageType
     * @returns {IOptions}
     */
    function getOptions(messageType) {
        const options = Object.assign({}, _defaults);
        if (messageType in _options) {
            Object.assign(options, _options[messageType]);
        }
        return options;
    }
    /**
     * Returns stack trace
     * @returns {string}
     */
    function getTrace() {
        return new Error()
            .stack
            .split("\n")
            .splice(3)
            .join("\n");
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
        if (typeof options.interpreter === "function") {
            for (const index in args) {
                /** Let string be without additional ' ' */
                if (typeof args[index] === "string") {
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
            switch (typeof options.timestamp) {
                case "boolean":
                    args.unshift(`[${new Date().toLocaleString()}]`);
                    break;
                case "string":
                    args.unshift(`[${moment().format(options.timestamp)}]`);
                    break;
                default:
                    throw new Error(`Invalid timestamp type (${typeof options.timestamp}). Should be (boolean | string)`);
            }
        }
        return args.join(" ");
    }
    /**
     * Main stdout function
     * @param {string} messageType
     * @returns {IStdout}
     */
    function stdout(messageType) {
        return (...args) => {
            const options = getOptions(messageType);
            let message = parse(messageType, args);
            /** Add trace to console.trace */
            if (messageType === "trace") {
                message += `\n${getTrace()}`;
            }
            /** Stdout to console */
            if (!options.fileOnly) {
                _console.log(message);
            }
            /** Stdout to file */
            if (typeof options.filePath === "string" && options.filePath.length > 0) {
                fs.appendFileSync(options.filePath, `${message}\n`);
            }
        };
    }
    Console2File.stdout = stdout;
    /**
     * Assign user options to object
     * @param {IOptions} defaults
     * @param {IOptions} userDefined
     */
    function assignOptions(defaults, userDefined) {
        for (const optionKey in userDefined) {
            if (defaults.hasOwnProperty(optionKey)) {
                defaults[optionKey] = userDefined[optionKey];
            }
            else {
                throw new Error(`Unknown {IOptions} parameter '${optionKey}'`);
            }
        }
        return defaults;
    }
    /**
     * Configure logger for specified message types
     * @param {Options | string | string[]} args
     */
    Console2File.config = (...args) => {
        let _types = Object.assign([], _consoleKeys);
        let _opts = Object.assign({}, _defaults);
        if (args.length === 0) {
            /** No params - configure default functions with default options */
        }
        else if (args.length === 1) {
            if (Array.isArray(args[0])) {
                /** Configure user functions with default options */
                _types = args[0];
            }
            else if (typeof args[0] === "string") {
                /** Configure user function with default options */
                _types = [args[0]];
            }
            else if (typeof args[0] === "object") {
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
            else if (typeof args[0] === "string") {
                /** Configure user function */
                _types = [args[0]];
            }
            else {
                throw new Error(`Expected {string | string[]} but got {${typeof args[0]}}`);
            }
            if (typeof args[1] === "object") {
                /** Configure with user options */
                _opts = assignOptions(_opts, args[1]);
            }
            else {
                throw new Error(`Expected {IOptions} but got {${typeof args[1]}}`);
            }
        }
        else {
            throw new Error(`Too much arguments. Expected 0 to 2 but got ${args.length}`);
        }
        /** Assign options to global variable and override console functions */
        for (const type of _types) {
            _options[type] = _opts;
            console[type] = stdout(type);
        }
    };
})(Console2File = exports.Console2File || (exports.Console2File = {}));
exports.c2f = Console2File;
exports.default = Console2File.config;
