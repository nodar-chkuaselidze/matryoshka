var Qfs = require('q-io/fs'),
    Q   = require('q'),
    _   = require('lodash'),
    path = require('path'),
    root = path.resolve(__dirname, '../');

function Matryoshka(depth) {
  this.depth = depth;
}

Matryoshka.LANGS_PATH = path.resolve(root, 'langs');

Matryoshka.languagePackers = function (language) {
  var langPath = path.resolve(Matryoshka.LANGS_PATH, language);

  return Qfs.listTree(langPath)
    .then(function (packers) {
      return packers.filter(/./.test.bind(/^.*\.js$/));
    });
};

Matryoshka.collectLanguages = function () {
  var langs;

  return Qfs.list(Matryoshka.LANGS_PATH)
    .then(function (languages) {
      var promises = languages.map(function (language) {
        return Matryoshka.languagePackers(language);
      });

      langs = languages;

      return Q.all(promises);
    })
    .then(function (languages) {
      return _.object(langs, languages);;
    });
};

module.exports = exports = Matryoshka;
