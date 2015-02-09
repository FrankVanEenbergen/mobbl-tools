/* Module: stylesheet_loader
 *
 * (C) Copyright Itude Mobile B.V., The Netherlands
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
