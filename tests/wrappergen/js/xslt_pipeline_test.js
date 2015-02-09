/* Test: XSLT Pipeline
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

// Test subjects
var xslt = require('../../../lib/wrappergen/xslt_wrapper');
var XsltPipeline = require('../../../lib/wrappergen/xslt_pipeline');

vows.describe('XSLT Pipeline').addBatch({
  'The XSLT Pipeline': {
    'when run with input "input" and two transforms: input -> intermediate and intermediate -> output': {
      topic : function() {
        var xsltPipeline = new XsltPipeline(xslt);

        var firstTransform = '<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:param name="test" /><xsl:template match="input"><intermediate test="{$test}" /></xsl:template></xsl:stylesheet>';
        var secondTransform = '<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:template match="intermediate"><output test="{@test}" /></xsl:template></xsl:stylesheet>';

        xsltPipeline.process([firstTransform, secondTransform], { test: "blabla" }, '<input />').nodeify(this.callback);
      },
      'should result in "output"' : function(err, result) {

        assert.ifError(err);
        assert.equal(result, '<?xml version="1.0" encoding="UTF-8"?><output test="blabla"/>');
      }
    }
  }
}).export(module);
