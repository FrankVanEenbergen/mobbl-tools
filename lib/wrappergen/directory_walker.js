/* Module: directory_walker
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

function DirectoryWalker(fs, path) {
  this.fs = fs;
  this.path = path;
}

DirectoryWalker.prototype.walk = function(baseDirectory, callback) {
  var absoluteBaseDirectory = this.path.resolve(baseDirectory);
  var isDirectory = this.fs.statSync(absoluteBaseDirectory).isDirectory();

  if (!isDirectory) {
    throw new Error("Path \"" + baseDirectory + "\"is not a directory.")
  }

  this.recursiveWalk(absoluteBaseDirectory, absoluteBaseDirectory, function(fileInfo) {
    callback({
      baseDirectory: baseDirectory,
      relativePath: fileInfo.relativePath,
      absolutePath: fileInfo.absolutePath,
      isDirectory: fileInfo.isDirectory
    });
  });
};

DirectoryWalker.prototype.recursiveWalk = function(baseDirectory, currentDirectory, callback) {

  var children = this.fs.readdirSync(currentDirectory);

  for (var index in children) {
    var childFileName = children[index];

    var absoluteChildPath = this.path.join(currentDirectory, childFileName);
    var isChildDirectory = this.fs.statSync(absoluteChildPath).isDirectory();

    var relativeChildPath = this.path.relative(baseDirectory, absoluteChildPath);

    callback({
      baseDirectory: baseDirectory,
      relativePath: relativeChildPath,
      absolutePath: absoluteChildPath,
      isDirectory: isChildDirectory
    });

    if (isChildDirectory) {
      this.recursiveWalk(baseDirectory, absoluteChildPath, callback);
    }
  }
}

/* exports */
module.exports = DirectoryWalker;
