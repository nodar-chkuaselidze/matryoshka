#!/usr/bin/env node

var optimist   = require('optimist'),
    Matryoshka = require('./lib/matryoshka'),
    Extract    = require('./lib/extract'),
    matryoshka, argv;

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

if (argv.help) {
  return optimist.showHelp();
}

if (argv.list) {
  console.log('  List of languages:');

  Matryoshka.collectLanguages().then(function (languages) {
    Object.keys(languages).forEach(function (language) {
      console.log('   ', language);
    });
  });

  return;
}

if (argv.x) {
  matryoshka = new Extract();
  matryoshka.extract();
  return;
}

matryoshka = new Matryoshka();
