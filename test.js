#!/usr/bin/env node

var optimist = require('optimist'),
    path = require('path'),
    stream = require('stream'),
    Qfs = require('q-io/fs'),
    Q = require('q'),
    lib = require('./lib'),
    fs = require('fs'),
    BT = require('buffertools'),
    helpers = require('./lib/helpers.js'),
    Matryoshka = lib.Matryoshka,
    argv, packers, tests;

tests = path.resolve(__dirname, 'test', 'packerTests');

argv = optimist
  .usage('Pack the input, Usage: $0')
  .options('p', {
    alias : 'packers',
    describe : 'which packers to test "c:hello-c,js:hello-js"',
  })
  .argv;

if (!argv.packers) error('Packers not found');

var packers = argv.packers.split(',').map(function (packer) {
  return [ packer.split(':'), Matryoshka.nameToPacker(packer)[1] ];
});

packers.forEach(function (packer) {
  var lang = packer[0][0],
    name = packer[0][1],
    fpath = path.resolve(tests, lang),
    testIn, testOut, packerClass;

  try {
    packerClass = require(packer[1]);
  } catch(e) {
    error('Could not find test files for ' + Matryoshka.packerToName(lang, packer[1]));
  }

  if (!(packerClass instanceof stream.Transform)) {
    error('Packer "' + Matryoshka.packerToName(lang, packer[1]) + '" is not valid!');
  }

  Qfs.list(fpath)
  .then(function (dfiles) {
    dfiles = dfiles.filter(function (dfile) {
      return /./.test.bind(new RegExp(name + '\.[0-9]*$'))(dfile);
    });

    return dfiles;
  })
  .then(function (dfiles) {
    dfiles.forEach(function (dfile) {
      var filePath = fpath + '/' + dfile;

      helpers.packIOFiles(packerClass, filePath, filePath + '.packed')
    });
  })
  .fail(function (error) {
    console.log(error);
  });
});

function streamDone(stream) {
  var str = new Buffer(0),
    deferred = Q.defer(),
    tmp;

  stream.on('readable', function () {
    while((tmp = stream.read()) != null) {
      str = Buffer.concat([ str, tmp ]);
    }

    console.log(str);
    deferred.resolve(str);
    str = null;
    tmp = null;
  });

  stream.on('error', function (error) {
    deferred.reject(error);
  });

  return deferred.promise;
}

function error(error) {
  console.error(error);
  process.exit(1);
};
