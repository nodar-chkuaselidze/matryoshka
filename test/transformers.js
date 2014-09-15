var
  path   = require('path'),
  stream = require('stream'),
  Qfs    = require('q-io/fs'),
  Q      = require('q'),
  lib    = require('../lib'),
  helpers    = require('../lib/helpers'),
  Matryoshka = lib.Matryoshka,
  Extract    = lib.Extract;

Matryoshka.collectLanguages()
  .then(function (languages) {
    var packerTestsPath = path.resolve(__dirname, 'packerTests');

    return Qfs.listTree(packerTestsPath)
      .then(function (files) {

        return [languages, files];
      });
  })
  .spread(function (languages, testFiles) {
    var files = Object.keys(languages)
      .reduce(function (prev, curr) {
        languages[curr].forEach(function (file) {
          prev[curr + ':' + path.basename(file).slice(0, -3)] = file;
        });

        return prev;
      }, {}),
    names = Object.keys(files);

    //tests
    describe('Existing Transformers', function () {
      names.forEach(function (name) {
        var file = files[name],
          packer = require(files[name]),
          dfiles;

        it('should be stream.Transform - ' + name, function () {
          packer.should.be.an.instanceOf(stream.Transform);
        });

        it('should fullfill it\'s test files - ' + name, function (done) {
          dfiles = testFiles.filter(function (dfile) {
            var testerFile = name.split(':');

            return /./.test.bind(new RegExp(testerFile[0] + '/' + testerFile[1] + '\.[0-9]*$'))(dfile);
          });

          var tests = [];

          dfiles.forEach(function (dfile) {
            tests.push(helpers.packIOFiles(packer, dfile, dfile + '.packed'));
          });

          Q.all(tests)
            .then(function () {
              done();
            })
            .fail(done);
        });
      });
    });
}); //languages
