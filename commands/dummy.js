function DummyCommand () {
}

var program = require ('commander');

DummyCommand.run = function(args) {
  program.version('0.0.1').usage('<arguments...>').option('-t, --tacos', 'Add tacos').description(this.longDescription).parse (args);

  debugger;

  if (program.args.length) {
    console.log(program.args.join(" "));
  } else {
    console.log('Dummy success!');
  }
}


DummyCommand.description = 'Dummy command!';

DummyCommand.longDescription = DummyCommand.description + ' Echoes <arguments>, or \'Dummy success!\' if no text was provided';

module.exports = DummyCommand;
