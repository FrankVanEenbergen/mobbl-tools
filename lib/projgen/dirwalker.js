/* Module: dirwalker
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
var path = require('path');
var fs = require('fs');

function DirectoryWalker(baseDirectory) {
  var absoluteBaseDirectory = path.resolve(baseDirectory);
  var isDirectory = fs.lstatSync(absoluteBaseDirectory).isDirectory();

  if (!isDirectory) {
    throw new Error("Path \"" + baseDirectory + "\"is not a directory.")
  }

  this.baseDirectory = absoluteBaseDirectory;
}


DirectoryWalker.prototype.walk = function(callback) {
  this.internalWalk(this.baseDirectory, callback);
}

DirectoryWalker.prototype.internalWalk = function(currentDirectory, callback) {

  var children = fs.readdirSync(currentDirectory);

  for (var index in children) {
    var childFileName = children[index];

    var absoluteChildPath = path.join(currentDirectory, childFileName);
    var isChildDirectory = fs.lstatSync(absoluteChildPath).isDirectory();

    var relativeChildPath = path.relative(this.baseDirectory, absoluteChildPath);

    callback({
      baseDirectory: this.baseDirectory,
      relativePath: relativeChildPath,
      absolutePath: absoluteChildPath,
      isDirectory: isChildDirectory
    });

    if (isChildDirectory) {
      this.internalWalk(absoluteChildPath, callback);
    }
  }
}

/* exports */
module.exports.DirectoryWalker = DirectoryWalker;
