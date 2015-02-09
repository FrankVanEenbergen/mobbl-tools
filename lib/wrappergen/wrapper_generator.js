"use strict"

/* Module: Code Generator
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

// Execution dependencies
var assert = require('assert');

function WrapperGenerator(fs, xsltPipeline, directoryWalker, stylesheetLoader) {
  this.fs = fs;
  this.xsltPipeline = xsltPipeline;
  this.directoryWalker = directoryWalker;
  this.stylesheetLoader = stylesheetLoader;
}

WrapperGenerator.prototype.generate = function(options)
{
  assert.equal(typeof options, 'object');
  assert.equal(typeof options.configDirectory, 'string');
  assert.equal(typeof options.language, 'string');
  assert.equal(typeof options.outputDirectory, 'string');

  var stylesheets = this.stylesheetLoader.getStylesheets(options.language);

  assert(stylesheets, 'Stylesheets should be an array instead of ' + (typeof stylesheets) + ':' + stylesheets);

  this.directoryWalker.walk(options.configDirectory, function(fileInfo) {
    var currentFile = fileInfo.absolutePath;
    if (!fileInfo.isDirectory && currentFile.match(/.+\.xml$/)) {

      var xsltParams = {
        outputDirectory: options.outputDirectory,
        origin: fileInfo.relativePath,
        'package': options['package'],
        devMode: options.devMode
      };

      var fileContents = this.fs.readFileSync(currentFile);
      this.xsltPipeline.process(stylesheets, xsltParams, fileContents).done(
        function(result) {
          console.log(result);
        }, function(err) {
          console.error('Error while reading ' + currentFile);
          console.error(err);
          throw err;
        });

    }
  }.bind(this));
}

module.exports = WrapperGenerator;
