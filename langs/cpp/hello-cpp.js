var stream = require('stream'),
    util   = require('util'),
    Transform = stream.Transform;

function HelloCppTransform () {
  if (!(this instanceof HelloCppTransform)) {
    return new HelloCppTransform();
  }

  this.data = '#include <iostream>\n\n' +
    'int str[] = {';

  this.endData = '};\n' +
    'int main() {\n' +
    '  for (long i = 0; i < sizeof(str) / sizeof(int); i++) {\n' +
    '    std::cout << str[i]);\n' +
    '  }\n' +
    '\n' +
    '  return 0;\n' +
    '}';

  this.startedReading = false;
  Transform.call(this);
};

util.inherits(HelloCppTransform, Transform);

HelloCppTransform.prototype._transform = function (chunk, enc, cb) {
  if (this.data != '') {
    this.push(this.data);
    this.data = '';
  }

  for (var i = 0, char; i < chunk.length; i++) {
    char = chunk[i];

    if (this.startedReading) {
      this.push(',')
    }

    this.push(char.toString());
    this.startedReading = true;
  }

  cb();
};

HelloCppTransform.prototype._flush = function (cb) {
  this.push(this.endData);
  cb();
};



module.exports = new HelloCppTransform();
