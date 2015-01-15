var cli = require('./lib/cli.js');

cli.registerCommand('dummy', require('./commands/dummy.js'));
cli.registerCommand('create', require('./commands/create.js'));
cli.parse (process.argv);
