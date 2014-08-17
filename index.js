#!/usr/bin/env node

var optimist = require('optimist'),
    argv;

argv = optimist
  .usage('Pack the input, Usage: $0')
  .alias('h', 'help')
  .describe('h', 'Load this help')
  .argv;

if (argv.help) {
  return optimist.showHelp();
}
