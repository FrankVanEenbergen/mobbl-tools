var xslt = require('xslt4node');
var path = require('path');

xslt.addLibrary(path.join(__dirname, '..', '..', 'share', 'wrappergen', 'saxon', 'saxon9he.jar'));

module.exports = xslt;
