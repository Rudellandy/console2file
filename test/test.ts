import {c2f} from "../lib";

interface ICustomConsole extends Console {
    rage: (message?: any, ...optionalParams) => void;
    _origin: Console;
}

declare const console: ICustomConsole;

c2f.config({
    fileOnly: false,
    labels: true,
    timestamp: "YYYY/MM/DD HH:mm:ss:SSS",
});

c2f.config("rage", {
    fileOnly: false,
    filePath: "./rage.log",
    labels: true,
});

console.log("Testing started");

console.info("Hey, you!", "I'm still here!");

console.error("Whoops! Something went wrong.");

console.warn("Warning!", "This is test alert.");

console.trace(["this", "is", "awesome"]);

console.debug({
    c2f: "is",
    such: "easy",
});

console.rage("quit");

console._origin.log("Old, not modified console.log");
