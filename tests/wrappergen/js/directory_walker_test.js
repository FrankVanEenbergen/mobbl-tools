/* Test: directory_walker
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

var vows = require('vows');
var assert = require('assert');
var sinon = require('sinon');
var mocks = require('mocks');
var DirectoryWalker = require('../../../lib/wrappergen/directory_walker');

vows.describe('Directory Walker').addBatch({
  'The dirwalker': {
    'when given a mock filesystem with one dir and one file': {
      topic: function() {
        var mockFS = mocks.fs.create({
          'baseDir' : {
            'dir1' : {
              'file1' : 1
            }
          }
        });

        // TODO: mock path
        return new DirectoryWalker(mockFS, require('path'));
      },

      'it should report 1 directory and 1 file': function(walker) {
        var spy = sinon.spy();
        walker.walk('/baseDir', spy);

        assert(spy.calledTwice,
          'callback should have been called 2 times, not ' + spy.callCount + ' time.');

        assert.deepEqual(spy.args[0][0], {
          baseDirectory:'/baseDir',
          relativePath:'dir1',
          absolutePath:'/baseDir/dir1',
          isDirectory: true
        });

        assert.deepEqual(spy.args[1][0], {
          baseDirectory:'/baseDir',
          relativePath:'dir1/file1',
          absolutePath:'/baseDir/dir1/file1',
          isDirectory: false
        })
          
      }
    }
  }
}).export(module);

