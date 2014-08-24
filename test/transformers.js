var
  path   = require('path'),
  stream = require('stream'),
  lib    = require('../lib'),
  Matryoshka = lib.Matryoshka,
  Extract    = lib.Extract;

Matryoshka.collectLanguages().then(function (languages) {

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
      var file = files[name], packer = require(files[name]);

      it('should be stream.Transform - ' + name, function () {
        packer.should.be.an.instanceOf(stream.Transform);
      });

    });
  });
}); //languages
