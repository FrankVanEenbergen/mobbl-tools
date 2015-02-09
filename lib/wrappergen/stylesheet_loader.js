function StylesheetLoader(fs, path) {
  this.fs = fs;
  this.path = path;
}

var fileNames = {
  'java': ['docdef-ir.xslt', 'ir-java.xslt'],
  'swift': ['docdef-ir.xslt', 'ir-swift.xslt']
};

StylesheetLoader.prototype.getStylesheets = function(language) {
  return this.getStylesheetPaths(language).map(function(path){ return this.fs.readFileSync(path); }, this);
};

StylesheetLoader.prototype.getStylesheetPaths = function(language) {
  var self = this;
  return fileNames[language].map(function(fileName) {
    return self.path.join(__dirname, '..', '..', 'share', 'wrappergen', 'xslt', language, fileName);
  });
};

module.exports = StylesheetLoader;
