"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
lib_1.c2f.config({
    fileOnly: false,
    labels: true,
    timestamp: "YYYY/MM/DD HH:mm:ss:SSS",
});
lib_1.c2f.config("rage", {
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
