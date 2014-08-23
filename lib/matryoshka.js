var Qfs = require('q-io/fs'),
    Q   = require('q'),
    _   = require('lodash'),
    path = require('path'),
    root = path.resolve(__dirname, '../'),
    stream = require('stream');

function Matryoshka(depth, streamIn, streamOut, queue) {
  var self = this;

  this.in    = streamIn;
  this.out   = streamOut;
  this.depth = depth;
  this.queue = queue;
}

Matryoshka.prototype.pack = function (langs, include) {
  var self = this;

  return this.processLanguages(langs, include)
    .then(function (languages) {
      var packers = [];

      for (var i = 0, packer, language; i < self.depth; i++) {
        packerFile = Matryoshka.getRandomLanguage(languages);
        packer     = require(packerFile);

        if (!(packer instanceof stream.Transform)) {
          throw new Error('Packer "' + packerFile + '" is not valid');
        }

        packers.push(packer);
      }

      return packers;
    })
    .then(function (packers) {
      var pipes = self.in;
      packers.forEach(function (packer) {
        pipes = pipes.pipe(packer);
      });

      pipes.pipe(self.out);
    });
};

Matryoshka.prototype.processLanguages = function (langs, include) {
  var self = this;

  if (this.queue) {
    throw new Error('Not Implemented Yet');
  }

  if (langs) {
    langs = langs.split(',');
  }

  return Matryoshka.collectLanguages()
    .then(function (languages) {
      if (!langs) return languages;

      var filter = include ? _.pick : _.omit;

      return filter(languages, langs);
    });
};

Matryoshka.getRandomLanguage = function (languages) {
  var keys = Object.keys(languages),
      key  = _.random(0, keys.length - 1),
      language = languages[keys[key]];

  return language[_.random(0, language.length - 1)];
};

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
