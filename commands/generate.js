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
    .action (function (options) {
      self.generateMobblConf (options);
    });

  program
    .command('wrappers')
    .description('Generate document wrapper classes (java/swift)')
    .option('-c, --config <config>', 'Path to the mobbl config directory')
    .option('-o, --output <output>', 'Path to output directory')
    .option('-L, --language <java|swift>', 'Target language')
    .option('-p, --package <package>', 'Java package')
    .option('-c, --class-prefix <prefix>', 'Class prefix')
    .option('-d, --debug', 'Debug mode: streams everyting to stdout')
    .action(self.generateDocumentWrappers.bind(self, program));

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

GenerateCommand.generateMobblConf = function (options) {
  var out = fs.createWriteStream ('./mobbl.conf');
  out.write (JSON.stringify (mobbl.config, null, '\t'));
}

GenerateCommand.generateDocumentWrappers = function(program, options) {
  var xslt = require('../lib/wrappergen/xslt_wrapper');
  var DirectoryWalker = require('../lib/wrappergen/directory_walker');
  var WrapperGenerator = require('../lib/wrappergen/wrapper_generator');
  var XsltPipeline = require('../lib/wrappergen/xslt_pipeline');
  var StylesheetLoader = require('../lib/wrappergen/stylesheet_loader');
  var path = require('path');


  if (arguments.length !== 2) {
    var unexpectdArguments = Array.prototype.slice.call(arguments, 1, -1);
    console.error('Unexepected command line arguments: ' + unexpectdArguments);
    program.help();
  } else if (!options.config) {
    console.error('-c/--config is a required option');
    program.help();
  } else if (!options.output) {
    console.error('-o/--output is a required option');
    program.help();
  } else if (!options.language) {
    console.error('-L/--language is a required option');
    program.help();
  } else if (options.language !== 'java' && options.language !== 'swift') {
    console.error('Target language should be java or swift');
    program.help();
  } else if (options.language === 'java' && !options['package']) {
    console.error('-p/--package is a required option, when target language is Java');
    program.help();
  }

  var parameters = {
    configDirectory: options.config,
    outputDirectory: options.output,
    language: options.language,
    devMode: !!options.debug
  };

  if (options.language === 'swift' && options.classPrefix) {
    parameters.classPrefix = options.classPrefix;
  }

  if (options.language === 'java') {
    parameters['package'] = options['package'];
  }

  var wrapperGenerator = new WrapperGenerator(
      fs,
      new XsltPipeline(xslt),
      new DirectoryWalker(fs, path),
      new StylesheetLoader(fs, path)
      );

  wrapperGenerator.generate(parameters);
}

GenerateCommand.description = 'Generate command!';

GenerateCommand.longDescription = GenerateCommand.description + ' Generates pieces of mobbl-configuration. See the individual commands for more details.';

module.exports = GenerateCommand;
