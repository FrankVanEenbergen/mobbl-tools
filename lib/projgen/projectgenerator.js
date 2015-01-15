/* Module: projectgenerator
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

/* external dependencies */
var fs = require('fs');
var replaceStream = require('replacestream');
var assert = require('assert');
var path = require('path');
var istextorbinary = require('istextorbinary');

/* internal dependencies */
var dirwalker = require('./dirwalker');

function ProjectGenerator(options) {
  assert(typeof options.templateDirectory !== 'undefined');
  assert(typeof options.targetDirectory !== 'undefined');
  assert(typeof options.pathTransforms !== 'undefined');
  assert(typeof options.textTransforms !== 'undefined');

  this.templateDirectory = options.templateDirectory;
  this.targetDirectory = options.targetDirectory;
  this.pathTransforms = options.pathTransforms;
  this.textTransforms = options.textTransforms;
}

ProjectGenerator.prototype.generate = function() {
  var directoryWalker = new dirwalker.DirectoryWalker(this.templateDirectory);

  assert.throws(function() {
    fs.lstatSync(this.targetDirectory);
  }.bind(this), 'File or directory already exists at target location.');

  fs.mkdirSync(this.targetDirectory);

  directoryWalker.walk(function(fileResult) {
    var transformedPath = this.transformPath(fileResult.relativePath);

    var absoluteTargetPath = path.join(this.targetDirectory, transformedPath);

    this.buildParentDirectories(transformedPath);

    if (fileResult.isDirectory) {
      fs.mkdirSync(absoluteTargetPath);
    } else {
      this.transferFile(fileResult.absolutePath, absoluteTargetPath);
    }

  }.bind(this));
}

ProjectGenerator.prototype.buildParentDirectories = function(filePath) {
  console.log("FILE:" + filePath);
  var parentDirectoryPath = path.dirname(filePath);
  console.log("PARE:" + parentDirectoryPath);
  var pathComponents = parentDirectoryPath.split(path.sep);
  console.log("COMP:" + pathComponents);

  for (var index = 0; index < pathComponents.length; index++) {
    console.log("INDE:" + index);
    var selectedComponents = pathComponents.slice(0, index + 1);
    console.log("SELE:" + selectedComponents);
    var joinedSelectedComponents = selectedComponents.join(path.sep);
    console.log("JOIN:" + joinedSelectedComponents);

    var absoluteSubPath = path.join(this.targetDirectory, joinedSelectedComponents);
    console.log("ABSO:" + absoluteSubPath);

    try {
      fs.mkdirSync(absoluteSubPath);
    } catch (err) {
      console.log("dir already in place: " + fs.lstatSync(absoluteSubPath).isDirectory());
      assert(fs.lstatSync(absoluteSubPath).isDirectory());
    }

  }

  console.log("-------------");
}

ProjectGenerator.prototype.transferFile = function(sourcePath, targetPath) {
    var readStream = fs.createReadStream(sourcePath);

    var isTextFile = istextorbinary.isTextSync(sourcePath, fs.readFileSync(sourcePath));

    if (isTextFile) {
      readStream = this.transformText(readStream);
    }

    var writeStream = fs.createWriteStream(targetPath);

    readStream.pipe(writeStream);
}

ProjectGenerator.prototype.transformPath = function(filePath) {
  var transformedPath = filePath;

  for (var pattern in this.pathTransforms) {
    var regex = new RegExp(pattern, 'g');
    var replacementValue = this.pathTransforms[pattern];

    transformedPath = transformedPath.replace(regex, replacementValue);
  }

  return transformedPath;
}

ProjectGenerator.prototype.transformText = function(readStream) {
  var transformedStream = readStream;

  for (var originalValue in this.textTransforms) {
    var replacementValue = this.textTransforms[originalValue];

    transformedStream = transformedStream.pipe(replaceStream(originalValue, replacementValue));
  }

  return transformedStream;
}

/* exports */
module.exports = ProjectGenerator;
