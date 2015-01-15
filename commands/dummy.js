function DummyCommand () {
}

DummyCommand.run = function(args) {
  if (args.length == 0)
    console.log ('Dummy success!');
  else
    console.log (args.join(' '));
}

DummyCommand.help = function() {
  console.log('Dummy command!\n\nUsage: mobbl dummy [<text>]\n\nEchos <text>, or \'Dummy success!\' if no text was provided');
}

DummyCommand.description = 'Dummy command!';

module.exports = DummyCommand;
