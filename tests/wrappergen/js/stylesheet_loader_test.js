/* Test: stylesheet_loader
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

"use strict";

// Execution dependencies
var vows = require('vows');
var assert = require('assert');
var sinon = require('sinon');
var mocks = require('mocks');
var path = require('path');

// Test subject
var StylesheetLoader = require('../../../lib/wrappergen/stylesheet_loader');

vows.describe('Stylesheet Loader').addBatch({
  'The stylesheet loader' : {
    'When asked about the java stylesheets paths' : {
      topic : function() {
        return new StylesheetLoader(undefined, path).getStylesheetPaths('java');
      },

      'should return the correct stylesheet paths' : function(paths) {
        assert.equal(paths.length, 2);
        assert.equal(path.resolve(paths[0]), path.resolve(path.join(__dirname, '..', '..', '..', 'share', 'wrappergen', 'xslt', 'java', 'docdef-ir.xslt')));
        assert.equal(path.resolve(paths[1]), path.resolve(path.join(__dirname, '..', '..', '..', 'share', 'wrappergen', 'xslt', 'java', 'ir-java.xslt')));
      }
    }
  }
}).export(module);
