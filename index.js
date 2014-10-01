#!/usr/bin/env node

var optimist = require('optimist'),
    CLI = require('./lib/CLI'),
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
  .options('q', {
    alias : 'queue',
    describe : 'Queue of packers'
  })
  .options('d', {
    alias : 'depth',
    describe : 'Depth of packers',
    default : 5
  })
  .options('i', {
    alias : 'include',
    describe : 'Include languages or encoders, comma separated "js,c:hello-c"',
  })
  .options('e', {
    alias : 'exclude',
    describe : 'Exclude languages or encoders, comma separated "js,c:hello-c"',
  })
  .argv;

new CLI(argv, optimist);
