var program = require('commander');

function Cli () {
}

Cli.commands = {};

Cli.parse = function (args) {
  program.version('0.0.1').usage('[command] arguments...').description("Tool to aid in MOBBL-development");

  for (var cmd in this.commands) {
      var command = this.commands[cmd];
      program.command(cmd, command.description);
  }


  // parse returns undefined when handing off to other program
  var result = program.parse (args);
  if (result) program.help();
}

Cli.registerCommand = function(name, command) {
  this.commands[name] = command;
}

module.exports = Cli;
