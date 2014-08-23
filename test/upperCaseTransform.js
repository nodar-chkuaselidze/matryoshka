var stream = require('stream'),
    util   = require('util'),
    Transform = stream.Transform;

function UpperCaseTransform () {
  if (!(this instanceof UpperCaseTransform)) {
    return new UpperCaseTransform();
  }

  Transform.call(this);
};

util.inherits(UpperCaseTransform, Transform);

UpperCaseTransform.prototype._transform = function (chunk, enc, cb) {
  this.push(new Buffer(chunk.toString().toUpperCase()), enc);
  cb();
};

module.exports = UpperCaseTransform;
