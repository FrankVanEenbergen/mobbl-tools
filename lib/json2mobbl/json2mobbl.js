/* Module: json2mobbl
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


function createIndent(amount) {
  var result= "";
  for (; amount > 0; --amount)
    result += '\t';
  return result;
}

function collectArray(data) {
  var result = {};
  for (var i =0; i < data.length; ++i) {
    for (var name in data[i]) {
      result[name] = data[i][name];
    }
}
  return result;
}

function convert(data, stream, indent) {
  if (!indent) indent = 0;
  for (var name in data) {
    var value = data[name];

    if (!isNaN(parseInt(name))) {
      var averageArray = collectArray(data);
      convert (averageArray, stream, indent);
      return;
    } else {

    stream.write(createIndent (indent) + "<Element name='" + name + "'");
    var type = null;
    var children = false;
    switch (typeof value) {
      case 'string':  type = "string"; break;
      case 'number':  type = "int"; break;
      case 'boolean':  type = "boolean"; break;
      case 'object': children = true; break;
    }

    if (type) stream.write("><Attribute name='text()' type='" + type + "'/></Element>");
    else if (children) {
      stream.write (">\n");
      convert (value, stream, indent+1);
      stream.write (createIndent (indent) + "</Element>");
    } else stream.write ("/>");
    stream.write ('\n');
  }
  }

}

module.exports = convert;
