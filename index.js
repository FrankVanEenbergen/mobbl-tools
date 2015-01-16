var cli = require('./lib/cli.js');

cli.registerCommand('dummy', require('./commands/dummy.js'));
cli.registerCommand('create', require('./commands/create.js'));
cli.registerCommand('generate', require('./commands/generate.js'));
cli.parse (process.argv);
