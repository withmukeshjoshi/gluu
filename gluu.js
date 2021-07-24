#!/usr/bin/env node
const {Gluu} = require('./src/index')
const [, , ...args] = process.argv;
new Gluu(args);

