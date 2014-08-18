#!/usr/bin/env node

var optimist = require('optimist'), argv;

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
  .options('f', {
    alias : 'file',
    describe : 'File to convert'
  })
  .options('o', {
    alias : 'output',
    describe : 'File output'
  })
  .options('x', {
    alias : 'extract',
    describe : 'Extract packed'
  })
  .options('d', {
    alias : 'depth',
    describe : 'Depth of packers',
    default : 5
  })
  .options('i', {
    alias : 'include',
    describe : 'Include languages, comma separated "js,c"',
  })
  .options('e', {
    alias : 'exclude',
    describe : 'Exclude languages, comma separated "js,c"',
  })
  .argv;

new require('./lib/CLI')(argv);
