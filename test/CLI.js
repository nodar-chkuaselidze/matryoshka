var should = require('should'),
    stream = require('stream'),
    CLI    = require('../lib/CLI.js');

//not exactly cool tests.. but still..
describe('CLI Tool', function () {
  var optimist = {}, argv = {},
    _log, _error, CLI_error;

  _log = console.log;
  _error = console.error;
  CLI_error = CLI.prototype.error;

  beforeEach(function () {
    optimist = {};
    argv = {};
  });

  afterEach(function () {
    console.log = _log;
    console.error = _error;
    CLI.prototype.error = CLI_error;
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

  it('should call list if -l is passed', function (done) {
    var _list = CLI.prototype.list, cli;

    argv = { list : true };

    CLI.prototype.list = function () {
      done();
    };

    cli = new CLI(argv, optimist);

    CLI.prototype.list = _list;
  });

  it('should return appropriate message if -l passed', function (done) {
    var cli = new CLI(argv, optimist);

    console.log = function (str) {
      console.log = _log;
      str.match('List of languages:').should.be.an.instanceOf(Array);
    };

    cli.list().then(function () {
      done();
    })
    .fail(function (error) {
      done(error);
    });
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

  it('should fail if output file can\'t be created', function (done) {
    CLI.prototype.error = function (error) {
      error.match('Could not write to file').should.be.an.instanceOf(Array);
      done();
    };

    argv = { output : 'nosuchDir/file' };
    new CLI(argv, optimist);
  });

  it('should exit process if error occurs', function (done) {
    var _exit = process.exit,
      errStr = 'error',
      errCode = 1;

    console.error = function () {};
    process.exit  = function (ecode) {
      if (errCode === ecode) {
        done();
      }
    };

    var cli = new CLI(argv, optimist);
    cli.error(errStr, errCode);

    process.exit = _exit;
  });
});
