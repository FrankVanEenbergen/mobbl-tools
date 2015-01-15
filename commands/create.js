function CreateCommand () {
}

CreateCommand.run = function(args) {
  if (args[0] == 'project') this.generateProject();
  else if (args[0] == 'controller' || args[0] == 'etc') console.log('Subcommand not implemented yet!');
  else {console.log('Unknown subcommand ' + args[0] + '. Usage:'); this.help ();}
}

CreateCommand.help = function() {
  console.log(this.description + '\n\nUsage: mobbl create project|controller|etc\n\nDoes one of:\nproject - interactively create a new MOBBL-project\ncontroller - creates a new controller (not implemented!)\netc - create something else\n');
}

CreateCommand.description = 'Create project, controller, etc.';

CreateCommand.generateProject = function () {

  var ProjectGenerator = require('../lib/projgen/projectgenerator');
  var userchoice = require('../lib/projgen/userchoice');

  /* external dependencies */
  //var program = require('commander');
  var prompt = require('prompt');

  //program
  //.version('0.1')
  //.option('-p, --project-name <name>', 'The name of the iOS project')
  //.parse(process.argv);

  prompt.start();

  userchoice.getUserChoice(function(result) {
    actuallyGenerateProject(result);
  });
}

CreateCommand.actuallyGenerateProject = function (parameters) {
  var path = require('path');

  var templatePathPerPlatform = {
    ios     : path.join(__dirname, '../share/projgen/ios-app-template/'),
    android : path.join(__dirname, '../share/projgen/android-app-template/')
  };

  if (parameters.platform.ios) {
    var iosProjectName = parameters.projectName.replace('*', 'ios');

    var iosGenerator = new ProjectGenerator({
      templateDirectory: templatePathPerPlatform.ios,
      targetDirectory: path.resolve(parameters.targetPath, iosProjectName),
      pathTransforms: {
        '__PROJECT_NAME__': iosProjectName,
        '__CLASS_PREFIX__': parameters.classPrefix
      },
      textTransforms: {
        '__PROJECT_NAME__': iosProjectName,
        '__BUNDLE_DISPLAY_NAME__': parameters.appName,
        '__BUNDLE_IDENTIFIER__': parameters.packageName,
        '__COMMENT_HEADING__': 'comment',
        '__CLASS_PREFIX__': parameters.classPrefix,
        '__MVN_ARTIFACT_ID__': iosProjectName,
        '__MVN_GROUP_IDENTIFIER__': parameters.packageName,
      }
    });

    iosGenerator.generate();
  }

  if (parameters.platform.android) {
    var androidProjectName = parameters.projectName.replace('*', 'android');

    var androidGenerator = new ProjectGenerator({
      templateDirectory: templatePathPerPlatform.android,
      targetDirectory: path.resolve(parameters.targetPath, androidProjectName),
      pathTransforms: {
        '__PROJECT_NAME__': parameters.projectName,
        '^src/' : 'src/' + parameters.packageName.replace(/\./g, '/') + '/'
      },
      textTransforms: {
        '__PROJECT_NAME__': androidProjectName,
        '__BUNDLE_DISPLAY_NAME__': parameters.appName,
        '__BUNDLE_IDENTIFIER__': parameters.packageName,
        '__COMMENT_HEADING__': 'comment',
        '__MVN_ARTIFACT_ID__': androidProjectName,
        '__MVN_GROUP_IDENTIFIER__': parameters.packageName,
      }
    });

    androidGenerator.generate();
  }
}

module.exports = CreateCommand;
