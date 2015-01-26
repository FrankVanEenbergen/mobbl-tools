function GenerateCommand () {
}

var program = require ('commander');
var fs = require('fs');
var json2mobbl = require('../lib/json2mobbl/json2mobbl');
var mobbl = require('../lib/mobbl-common.js');
var util = require('util');

GenerateCommand.run = function(args) {
  var self = this;
  program.version('0.0.1').description(this.longDescription);

  program
  .command('docdef <name>')
  .description('Generate a document definition')
  .option('-f, --from <file>', 'Use a file to base the document on. Supported types: json')
  .option('-d, --datahandler <name>', 'Use name as the datahandler. Default: MBMemoryDataHandler')
  .option('-n, --noautocreate', 'Sets autocreate to false')
  .action(function (name, options) {
    self.generateDocDef (name, options);
  });

  program
  .command('mobbl.conf')
  .description('Generate a mobbl.conf file based on auto-detected directory structure')
  .action (function (name, options) {
    self.generateMobblConf (name, options);
  });

  program.parse (args);
}

GenerateCommand.generateDocDef = function (name, options) {
  var preamble='<Configuration xmlns="http://itude.com/schemas/MB/1.0">\n\t<Documents>\n\t\t<Document name="%s" dataManager="%s" autoCreate="%s">\n';
  preamble = util.format (preamble, name, options.datahandler?options.datahandler : 'MBMemoryDataHandler', options.noautocreate?'false' : 'true');

  var postamble = '\t\t</Document>\n\t</Documents>\n</Configuration>';

  var out = fs.createWriteStream (mobbl.config.docdefPath + "/" + name + ".xml");
  out.write (preamble);

  if (options.from) {
    var data = fs.readFileSync (options.from);
    var object = JSON.parse(data.toString ());
    json2mobbl (object, out, 3);
  }

  out.write (postamble);
}

GenerateCommand.generateMobblConf = function (name, options) {
  var out = fs.createWriteStream ('./mobbl.conf');
  out.write (JSON.stringify (mobbl.config, null, '\t'));
}

GenerateCommand.description = 'Generate command!';

GenerateCommand.longDescription = GenerateCommand.description + ' Generates pieces of mobbl-configuration. See the individual commands for more details.';

module.exports = GenerateCommand;
