var path       = require('path'),
    fs         = require('fs'),
    Matryoshka = require('./matryoshka'),
    Extract    = require('./extract');

function CLI(argv, optimist, dontPack) {
  this.argv  = argv;
  this.in    = process.stdin;
  this.out   = process.stdout;
  this.depth = parseInt(argv.depth);

  if (argv.help)    return optimist.showHelp();
  if (argv.list)    return this.list();
  if (argv.file)    this.fileInit();
  if (argv.output)  this.outputInit();
  if (argv.extract) return this.extract();

  if (!dontPack) {
    this.pack();
  }
};

CLI.prototype.pack = function () {
  var matryoshka = new Matryoshka(this.depth, this.in, this.out, this.queue),
      argv = this.argv,
      self = this;

  matryoshka.pack(argv.include ? argv.include : argv.exclude, !!argv.include)
    .fail(function (error) {
      self.error(error.message, error.code);
    });
};

CLI.prototype.extract = function () {
  this.error('Extract is not implemented yet');
};

CLI.prototype.fileInit = function () {
  this.file = path.resolve(this.argv.file);

  if (!fs.existsSync(this.file)) {
    this.error('File "' + this.file + '" not found');
    return;
  }

  var stats = fs.statSync(this.file);
  if (stats.isFile()) {
    this.in = fs.createReadStream(this.file);
  }
};

CLI.prototype.outputInit = function () {
  var self = this;

  this.output = path.resolve(this.argv.output);
  if (fs.existsSync(this.output)) {
    this.error('File "' + this.output + '" already exists, won\'t overwrite');
  }

  this.out = fs.createWriteStream(this.output);
  this.out.on('error', function () {
    self.error('Could not write to file "' + self.output + '"');
  });
};

CLI.prototype.list = function () {
  console.log('  List of languages:');

  Matryoshka.collectLanguages().then(function (languages) {
    Object.keys(languages).forEach(function (language) {
      console.log('   ', language);
    });
  });
};

CLI.prototype.error = function (error, errcode) {
  errcode = errcode || 1;

  console.error(error);
  process.exit(errcode);
}

module.exports = exports = CLI;
