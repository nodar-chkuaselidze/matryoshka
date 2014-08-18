#!/usr/bin/env node

var optimist   = require('optimist'),
    path       = require('path'),
    fs         = require('fs'),
    Matryoshka = require('./lib/matryoshka'),
    Extract    = require('./lib/extract'),
    matryoshka, argv,
    stdin, stdout;

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

function CLI(argv) {
  this.argv = argv;
  this.in   = process.stdin;
  this.out  = process.stdout;

  if (argv.help)   return this.help();
  if (argv.list)   return this.list();
  if (argv.file)   this.fileInit();
  if (argv.output) this.outputInit();
};

CLI.prototype.fileInit = function () {
  this.file = path.resolve(this.argv.file);

  if (!fs.existsSync(this.file)) {
    this.error('File "' + this.file + '" not found');
  }

  var stats = fs.statSync(this.file);
  if (stats.isFile()) {
    this.in = fs.createReadStream(this.file);
  }
};

CLI.prototype.outputInit = function () {
  var self = this;

  this.output = path.resolve(this.argv.output);
  if (fs.existsSync(this.output)) {
    this.error('File "' + this.output + '" already exists, won\'t overwrite');
  }

  this.out = fs.createWriteStream(this.output);
  this.out.on('error', function () {
    self.error('Could not write to file "' + self.output + '"');
  });
};

CLI.prototype.help = function () {
  optimist.showHelp();
};

CLI.prototype.list = function () {
  console.log('  List of languages:');

  Matryoshka.collectLanguages().then(function (languages) {
    Object.keys(languages).forEach(function (language) {
      console.log('   ', language);
    });
  });
};

CLI.prototype.error = function (error, errcode) {
  errcode = errcode || 1;

  console.error(error);
  process.exit(errcode);
}

new CLI(argv);
