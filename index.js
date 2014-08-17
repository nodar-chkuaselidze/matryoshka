#!/usr/bin/env node

var optimist = require('optimist'),
    argv;

argv = optimist
  .usage('Pack the input, Usage: $0')
  .alias('h', 'help')
  .describe('h', 'Load this help')
  .alias('l', 'list')
  .describe('l', 'List of languages')
  .alias('i', 'include')
  .describe('i', 'Include languages')
  .alias('e', 'exclude')
  .describe('e', 'Exclude languages')
  .describe('x', 'Extract packed')
  .argv;

if (argv.help) {
  return optimist.showHelp();
}
