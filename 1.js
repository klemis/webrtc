#!/usr/bin/env node
var args = require("minimist")(process.argv.slice(2),{string:"name"})

var name = args.name


console.log("Hello " + name);
