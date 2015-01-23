function GenerateCommand () {
}

var program = require ('commander');
var fs = require('fs');
var json2mobbl = require('../lib/json2mobbl/json2mobbl');
var mobbl = require('../lib/mobbl-common.js');

GenerateCommand.run = function(args) {
  var self = this;
  program.version('0.0.1').description(this.longDescription);

  program
  .command('docdef <name>')
  .description('Generate a document definition')
  .option('-f, --from <file>', 'Use a file to base the document on. Supported types: json')
  .action(function (name, options) {
    self.generateDocDef (name, options.from);
  });

  program.parse (args);


}

GenerateCommand.generateDocDef = function (name, input) {
  if (input) {

  fs.readFile (input, 'utf8', function (err, data) {
    if (err) return console.log("Error: " + err);
    debugger;

    var object = JSON.parse(data);
    var out = fs.createWriteStream (mobbl.config.documentPath + "/" + name);
    json2mobbl (object, out);
  });
}
}

GenerateCommand.description = 'Generate command!';

GenerateCommand.longDescription = GenerateCommand.description + ' Echoes <arguments>, or \'Generate success!\' if no text was provided';

module.exports = GenerateCommand;
