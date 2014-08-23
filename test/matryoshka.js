var should = require('should'),
  stream  = require('stream'),
  Matryoshka = require('../lib/').Matryoshka,
  Qfs = require('q-io/fs'),
  Q = require('q'),
  UpperCaseTransform = require('./upperCaseTransform'),
  langs;

describe('Matryoshka Packer API', function () {
  var matryoshka = new Matryoshka(0, process.stdin, process.stdout);

  it('should have static method languagePackers to collect packers based on language', function (done) {
    Matryoshka.languagePackers('js').then(function (cPackers) {
      cPackers.should.be.an.instanceOf(Array);
      done();
    })
    .fail(function (error) {
      done(error);
    });
  });

  it('should have static method collectLanguages to collect all languages', function (done) {
    Matryoshka.collectLanguages().then(function (languages) {
      var files = [], promises;

      languages.should.be.an.instanceOf(Object);

      Object.keys(languages).forEach(function (lang) {
        languages[lang].should.be.an.instanceOf(Array);
        files = files.concat(languages[lang]);
      });

      promises = files.map(function (file) {
        file.should.be.type('string');
        file.should.endWith('.js');

        return Qfs.isFile(file).then(function (isFile) {
          isFile.should.equal(true);
        });
      });

      Q.all(promises)
        .then(function () {
          done();
        })
        .fail(function (error) {
          done(error);
        });

    })
    .fail(function (error) {
      done(error);
    });
  });

  it('should take random language from langs object', function (done) {
    Matryoshka.collectLanguages().then(function (languages) {
      var randPacker = Matryoshka.getRandomLanguage(languages);

      randPacker.should.be.type('string');
      randPacker.should.endWith('.js');
      done();
    })
    .fail(function (error) {
      done(error);
    });
  });

  it('should include languages that are in include list', function (done) {
    matryoshka.processLanguages('c,js', true)
      .then(function (languages) {
        var keys = Object.keys(languages);
        keys.should.be.an.instanceOf(Array);
        keys.length.should.equal(2);
        languages.should.have.property('c');
        languages.should.have.property('js');

        done();
      })
      .fail(function (error) {
        done(error);
      });
  });

  it('should exclude languages that are in exclude list', function (done) {
    matryoshka.processLanguages('c,js', false)
      .then(function (languages) {
        languages.should.not.have.property('c');
        languages.should.not.have.property('js');

        done();
      })
      .fail(function (error) {
        done(error);
      });
  });

  it('should pack with test packer', function (done) {
    var
      strToPipe = 'hello world',
      expectedStr = strToPipe.toUpperCase(),
      inStream = new stream.PassThrough(),
      outStream = new stream.PassThrough(),
      matryoshka = new Matryoshka(1, inStream, outStream);

      matryoshka.pipeAll([ new UpperCaseTransform() ]);

      inStream.end(strToPipe, 'utf8');
      outStream.on('readable', function () {
        var str = '', tmp;
        while((tmp = outStream.read()) != null) {
          str += tmp.toString();
        }

        str.should.equal(expectedStr);
        done();
      });
  });
});
