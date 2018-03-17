import * as util from 'util';
import * as fs from 'fs';

export module Console2File {

    export interface c2fConsole extends Console {
        _origin: Console;
    }

    export interface Options {
        filePath?: string;
        fileOnly?: boolean;
        labels?: boolean;
        timestamp?: boolean;
        interpreter?: (...args) => any;
    }

    export interface StdoutFunction {
        (message?: any, ...optionalParams): void;
    }

    export interface ConfigFunction {
        (options?: Options): void;
        (messageType: string | string[], options?: Options): void;
    }

    declare let console: c2fConsole;

    /**
     * Save console before override
     * @type {Console}
     * @private
     */
    const _console: Console = Object.assign({}, console);

    /** Assign _origin property to allow access to original console */
    console._origin = _console;

    /**
     * All console loggers without debug (debug will be used as console.log)
     * @type {string[]}
     * @private
     */
    const _consoleKeys = [
        'log', 'info', 'warn', 'error', 'trace', 'debug'
    ];

    /**
     * Default options
     * @type {Options}
     * @private
     */
    const _defaults: Options = {
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
    let _options: Options[] = [];

    /**
     * Returns options for specified message type
     * @param {string} messageType
     * @returns {Console2File.Options}
     */
    function getOptions(messageType: string): Options {
        let options = Object.assign({}, _defaults);

        if (messageType in _options) {
            Object.assign(options, _options[messageType]);
        }

        return options;
    }

    /**
     * Returns stack trace
     * @returns {string}
     */
    function getTrace(): string {
        return new Error()
            .stack
            .split('\n')
            .splice(3)
            .join('\n');
    }

    /**
     * Prepare message and return as string
     * @param {string} messageType
     * @param args
     * @returns {string}
     */
    function parse(messageType: string, args: any[]): string {
        const options = getOptions(messageType);

        /** Interpreter */
        if (typeof options.interpreter === 'function') {
            for(let index in args) {
                /** Let string be without additional ' ' */
                if (typeof args[index] === 'string') { continue; }

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
    export function stdout(messageType: string): StdoutFunction {
        return function(...args): void {
            let options = getOptions(messageType);

            let message = parse(messageType, args);

            /** Add trace to console.trace */
            if (messageType === 'trace') {
                message += `\n${getTrace()}`;
            }

            /** Stdout to console */
            if (!options.fileOnly) {
                _console.log(message);
            }

            /** Stdout to file */
            if (typeof options.filePath === 'string' && options.filePath.length > 0) {
                fs.appendFileSync(options.filePath, `${message}\n`);
            }
        };
    }

    /**
     * Assign user options to object
     * @param {Options} defaults
     * @param {Options} userDefined
     */
    function assignOptions(defaults: Options, userDefined: Options): Options {
        for (let optionKey in userDefined) {
            if (defaults.hasOwnProperty(optionKey)) {
                defaults[optionKey] = userDefined[optionKey];
            } else {
                throw new Error(`Unknown {Options} parameter '${optionKey}'`);
            }
        }

        return defaults;
    }

    /**
     * Configure logger for specified message types
     * @param {Options | string | string[]} args
     */
    export const config: ConfigFunction = (...args): void => {
        let _types: string[] = Object.assign([], _consoleKeys).concat(['debug']);
        let _opts: Options = Object.assign({}, _defaults);

        if (args.length === 0) {
            /** No params - configure default functions with default options */
        } else if (args.length === 1) {
            if (Array.isArray(args[0])) {
                /** Configure user functions with default options */
                _types = args[0];
            } else if (typeof args[0] === 'string') {
                /** Configure user function with default options */
                _types = [args[0]];
            } else if (typeof args[0] === 'object') {
                /** Configure default functions with user options */
                _opts = assignOptions(_opts, args[0]);
            } else {
                throw new Error(`Expected {Options | string | string[]} but got {${typeof args[0]}}`);
            }
        } else if (args.length === 2) {
            if (Array.isArray(args[0])) {
                /** Configure user functions */
                _types = args[0];
            } else if (typeof args[0] === 'string') {
                /** Configure user function */
                _types = [args[0]];
            } else {
                throw new Error(`Expected {string | string[]} but got {${typeof args[0]}}`);
            }

            if (typeof args[1] === 'object') {
                /** Configure with user options */
                _opts = assignOptions(_opts, args[1]);
            } else {
                throw new Error(`Expected {Options} but got {${typeof args[1]}}`);
            }
        } else {
            throw new Error(`Too much arguments. Expected 0 to 2 but got ${args.length}`);
        }

        /** Assign options to global variable and override console functions */
        for (let type of _types) {
            _options[type] = _opts;

            console[type] = stdout(type);
        }
    };

}

export const c2f = Console2File;

export default Console2File.config;