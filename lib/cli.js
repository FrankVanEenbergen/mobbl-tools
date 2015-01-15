function Cli () {
}

Cli.commands = {};

Cli.parse = function (command, args) {
  if (command == 'help') {
    this.help (args[0])
  } else if (this.commands[command]) {
    this.commands[command].run(args);
  } else {
    console.log('Unknown command: ' + command);
  }
}

Cli.help = function (command) {
  if (this.commands[command]) this.commands[command].help ();
  else {
    console.log ('MOBBL development tools.\n\nAvailable commands:\n');
    for (var cmd in this.commands)
      console.log (cmd + ' - ' + this.commands[cmd].description);

    console.log('\nEnter \'mobbl help <command>\' to get more information for that command');

  }
}

Cli.registerCommand = function(name, command) {
  this.commands[name] = command;
}

module.exports = Cli;
