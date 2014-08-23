var should = require('should'),
  Matryoshka = require('../lib/').Matryoshka;

describe('Matryoshka Packer API', function () {
  it('should have static method languagePackers to collect packers based on language', function (done) {
    Matryoshka.languagePackers('js').then(function (cPackers) {
      cPackers.should.be.an.Array;
      done();
    });
  });
});
