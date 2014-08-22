var should = require('should'),
    stream = require('stream'),
    CLI    = require('../lib/CLI.js');

describe('CLI Tool', function () {
  var optimist = {}, argv = {},
    _log, _error;

  beforeEach(function () {
    optimist = {};
    argv = {};
    _log = console.log;
    _error = console.error;
  });

  afterEach(function () {
    console.log = _log;
    console.error = _error;
  });

  it('should call showHelp if -h is passed', function (done) {
    argv = { h : true, help : true };
    optimist.showHelp = done;

    new CLI(argv, optimist);
  });

  it('should use stdin and stdout for input/output if files are not provided', function () {
    var cli = new CLI(argv, optimist);

    should(cli).have.property('in',  process.stdin);
    should(cli).have.property('out', process.stdout);
  });

  it('should return languages if -l is passed', function () {
  });

  it('should return error if file not found', function (done) {
    argv = { file : 'filethat!@#$%\n^CantExist' };

    CLI.prototype.error = function (error) {
      var notFoundExp = /not found/

      notFoundExp.test(error).should.equal(true);
      done();
    };

    var cli = new CLI(argv, optimist);
  });

  it('should return error if output file exists', function (done) {
    argv = { output : 'test/file' };

    CLI.prototype.error = function (error) {
      var fileExistsExp = /already exists/

      fileExistsExp.test(error).should.equal(true);
      done();
    };

    var cli = new CLI(argv, optimist);
  });

  it('should have in parameter as ReadableStream', function () {
    argv = { file : 'test/file', depth : 0 };

    var cli = new CLI(argv, optimist);
    should(cli).have.property('in').and.be.an.instanceOf(stream.Readable);
  });
});
