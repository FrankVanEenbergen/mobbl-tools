/* Module: XSLT Pipeline
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

var assert = require('assert');
var Q = require('q');

function XsltPipeline(xslt) {
  this.xslt = xslt;
}

XsltPipeline.prototype.process = function(stylesheets, parameters, input) {
  try {
    assert(Array.isArray(stylesheets), 'stylesheets should be an array not (a) ' + (typeof stylesheets) + ':' + stylesheets);
    assert(typeof input === 'string' || input instanceof Buffer, 'input param should be String or Buffer');
  } catch (err) {
    return Q.reject(err);
  }

  if (stylesheets.length > 0) {
    var config = {
      xslt: stylesheets[0],
      source: input,
      result: function String() {},
      params: parameters
    };

    return Q.ninvoke(this.xslt, 'transform', config).then(function(result) {
      return this.process(stylesheets.slice(1), {}, result);
    }.bind(this));
  } else {
    return Q(input);
  }
};

module.exports = XsltPipeline;
