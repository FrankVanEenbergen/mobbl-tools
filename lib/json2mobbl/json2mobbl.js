
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
