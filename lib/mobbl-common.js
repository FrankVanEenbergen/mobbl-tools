var fs = require('fs'),
    xml2js = require('xml2js');


parsePom = function () {
  var config = {rootPath:'.'};

  if (!fs.existsSync ('pom.xml')) return config;

  var pom = fs.readFileSync ('pom.xml');
  var obj = xml2js.parseString (pom, {async: false}, function (err, result) {
    var packaging = result.project.packaging[0];
    switch (packaging) {
      case 'xcode-app': config.type= 'ios';
        config.rootPath = 'src/xcode/' + result.project.artifactId;
        break;
      case 'pom':
        config.rootPath = './' + result.project.modules[0].module[0];
      case 'apk': config.type =  'android';
      break;
    }
  });

  return config;

}

parseMobblConf = function () {
  var data = fs.existsSync ('mobbl.conf') ? fs.readFileSync ('mobbl.conf') :  null;
  var config = data?JSON.parse(data.toString ()) : {};
  return config;
}

coalesce = function(configs) {
  if (configs.length == 1) return configs[0];
  else {
    for (var name in configs[1]) {
      if (!configs[0][name])
        configs[0][name] = configs[1][name];
    }

    return coalesce (configs.splice (1,1));
  }
}

fillPath = function (config, pathName, defaults) {
  if (config[pathName]) config[pathName] = config.rootPath + '/' + config[pathName];
  else config[pathName] = config.rootPath + defaults[config.type];
}


getConfig = function () {

  var config = coalesce ([parseMobblConf (), parsePom ()]);

  if (!config.type) {
    console.log("Warning: Application type unclear");
  }

  if (!config.rootPath) config.rootPath = '.';

  fillPath (config, 'documentPath', {ios: '/Resources/Documents', android: '/assets/documents', undefined: '/'});
  fillPath (config, 'docdefPath', {ios: '/Resources/Config/Documents', android: '/assets/config/documents', undefined: '/'});

  return config;
}

module.exports = {"config": getConfig ()};
