var stream = require('stream'),
    util   = require('util'),
    Transform = stream.Transform;

function HelloCTransform () {
  if (!(this instanceof HelloCTransform)) {
    return new HelloCTransform();
  }

  console.log("------constructed-----");
  this.data = '#include <stdio.h>\n\n' +
    'int str[] = {';

  this.endData = '};\n' +
    'int main() {\n' +
    '  for (long i = 0; i < sizeof(str) / sizeof(int); i++) {\n' +
    '    printf("%c", str[i]);\n' +
    '  }\n' +
    '\n' +
    '  return 0;\n' +
    '}';

  this.startedReading = false;
  Transform.call(this);
};

util.inherits(HelloCTransform, Transform);

HelloCTransform.prototype._transform = function (chunk, enc, cb) {
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
  console.log(chunk.length);

  cb();
};

HelloCTransform.prototype._flush = function (cb) {
  this.push(this.endData);
  cb();
};



module.exports = new HelloCTransform();
