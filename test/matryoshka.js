var should = require('should'),
  Matryoshka = require('../lib/').Matryoshka,
  langs;

describe('Matryoshka Packer API', function () {
  it('should have static method languagePackers to collect packers based on language', function (done) {
    Matryoshka.languagePackers('js').then(function (cPackers) {
      cPackers.should.be.an.Array;
      done();
    });
  });

  it('should have static method collectLanguages to collect all languages', function (done) {
    Matryoshka.collectLanguages().then(function (languages) {
      languages.should.be.an.instanceOf(Object);

      Object.keys(languages).forEach(function (lang) {
        lang.should.be.an.instanceOf(Array);
        done();
      });
    });
  });
});
