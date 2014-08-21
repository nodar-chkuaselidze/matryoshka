var should = require('should'),
    CLI    = require('../lib/CLI.js');

describe('CLI Tool', function () {
  var optimist = {}, argv = {};

  beforeEach(function () {
    optimist = {};
    argv = {};
  });

  it('should call showHelp if -h is passed', function (done) {
    argv = { h : true, help : true };
    optimist.showHelp = done;

    new CLI(argv, optimist);
  });

  it('should use stdin and stdout for input/output if files are not provided', function () {
    var cli = new CLI(argv, optimist);

    cli.in.should.equal(process.stdin);
    cli.out.should.equal(process.stdout);
  });
});
