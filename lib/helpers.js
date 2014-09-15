var bt = require('buffertools'),
    fs = require('fs'),
    Q  = require('q'),
    Qfs = require('q-io/fs'),
    lib = require('./'),
    stream = require('stream'),
    Matryoshka = lib.Matryoshka,
    Extract    = lib.Extract;

function packIOFiles(packer, fileIn, fileOut) {
  var readStreamQ = Q.denodeify(readStream),
      matryoshka,
      fileStreamIn,
      fileStreamOut,
      storeOutput;

  return checkFilesExistance(fileIn, fileOut)
    .then(function () {
      fileStreamIn  = fs.createReadStream(fileIn),
      fileStreamOut = fs.createReadStream(fileOut),
      storeOutput   = new stream.PassThrough(),
      matryoshka    = new Matryoshka(0, fileStreamIn, storeOutput);

      return matryoshka.pipeAll([ packer ]);
    })
    .then(function () {
      var outputBuffer, fileOutBuffer;

      return Q.all([ readStreamQ(storeOutput), readStreamQ(fileStreamOut) ])
        .spread(function (matryoshkaBuff, expectedBuff) {
          var equals = bt.equals(matryoshkaBuff, expectedBuff),
            startStr = '\n=====>\n',
            endStr = '\n<=====\n';

          if (!equals) {
            throw new Error(
              '-->Matryoshka pack output:' + startStr +
              matryoshkaBuff.toString() + endStr +
              '-->Does not equal expected string: ' + startStr +
              expectedBuff.toString() + endStr
            );
          } else {
            console.log('test passes');
          }
        });
    });
}

function readStream(stream, done) {
  var buffer = new Buffer('');
  stream.on('readable', function () {
    var tmp;

    while ((tmp = stream.read()) != null) {
      buffer = bt.concat(buffer, tmp);
    }
  });

  stream.on('end', function () {
    done(null, buffer);
  });
}

function checkFilesExistance(/* files... */) {
  var args = argsToArray(arguments), promises;

  promises = args.map(function (file) {
    return Qfs.isFile(file);
  });

  return Q.all(promises).then(function (checks) {
    var falseIndex = checks.indexOf(false);
    if (falseIndex != -1) {
      throw new Error('File "' + args[falseIndex] + '" was not found');
    }
  });
}

function argsToArray(args) {
  var argumentsArray = [];

  for (var i = 0; i < args.length; i++) {
    argumentsArray.push(args[i]);
  }

  return argumentsArray;
}

exports.packIOFiles = packIOFiles;
exports.checkFilesExistance = checkFilesExistance;
exports.argsToArray = argsToArray;
