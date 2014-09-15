var stream = require('stream'),
    util   = require('util'),
    Transform = stream.Transform;

function HelloJsTransform () {
  if (!(this instanceof HelloJsTransform)) {
    return new HelloJsTransform();
  }

  this.data = '';
  this.endData = '';

  this.startedReading = false;
  Transform.call(this);
};

util.inherits(HelloJsTransform, Transform);

HelloJsTransform.prototype._transform = function (chunk, enc, cb) {
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

HelloJsTransform.prototype._flush = function (cb) {
  this.push(this.endData);
  cb();
};



module.exports = HelloJsTransform;
