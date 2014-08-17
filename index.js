#!/usr/bin/env node

var optimist   = require('optimist'),
    argv;

argv = optimist
  .usage('Pack the input, Usage: $0')
  .options('h', {
    alias : 'help',
    describe : 'Load this help'
  })
  .options('l', {
    alias : 'list',
    describe : 'List available languages'
  })
  .options('x', {
    alias : 'extract',
    describe : 'Extract packed'
  })
  .options('i', {
    alias : 'include',
    describe : 'Include languages'
  })
  .options('e', {
    alias : 'exclude',
    describe : 'Exclude languages',
  })
  .argv;

if (argv.help) {
  return optimist.showHelp();
}
