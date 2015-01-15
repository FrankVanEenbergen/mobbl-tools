/* Module: userchoice
 *
 * (C) Copyright Itude Mobile B.V., The Netherlands
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/* internal dependecies */
var regexes = require('./regexes');

/* external dependencies */
var prompt = require('prompt');

var platformQuestions = {
  properties : {
    platform : {
      description: 'Which platform do you want to generate a project for?\n1. iOS\n2. Android\n3. iOS & Android\n',
      type : 'number',
      required : true,
      pattern : /^[123]$/,
      message : 'You must choose an existing option (1, 2 or 3).',
      default : 1
    }
  }
};

var generalQuestions = {
  properties : {
    projectName : {
      description : 'Project name (* will be substituted with ios or android)',
      type : 'string',
      required : true,
      pattern : regexes.alphanumeric_hyphen_underscore_with_star,
      message : 'Only alphanumeric characters, \'-\' and \'_\' are allowed. (and * of course)',
    },
    appName : {
      description : 'The display name of the app',
      type : 'string',
      required : true
    },
    packageName : {
      description : 'Bundle Identifier / Package name',
      type : 'string',
      required : true,
      pattern : regexes.domain_name_like
    },
    targetPath : {
      description : 'At what location should the project directories be created? (Current directory is ' + process.cwd() + ')',
      type : 'string',
      required : 'true',
      default : '.'
    }
  }
};

var iosQuestions = {
  properties : {
    classPrefix : {
      description : 'Class prefix',
      type : 'string',
      required : false,
      default : ''
    }
  }
};

function getUserChoice(callback) {
  var userChoice = {};

  prompt.get(platformQuestions, function(err, result) {
    if (result.platform === 1) {
      userChoice.platform = {ios: true, android: false};
    } else if (result.platform === 2) {
      userChoice.platform = {ios: false, android: true};
    } else if (result.platform === 3) {
      userChoice.platform = {ios: true, android: true};
    }


    prompt.get(generalQuestions, function(err, result) {
      userChoice.projectName = result.projectName;
      userChoice.appName = result.appName;
      userChoice.packageName = result.packageName;
      userChoice.targetPath = result.targetPath;

      if (userChoice.platform.ios) {
        prompt.get(iosQuestions, function(err, result) {
          userChoice.classPrefix = result.classPrefix;

          callback(userChoice);
        });
      } else {
        callback(userChoice);
      }
    });
  });
}

/* exports */
module.exports.getUserChoice = getUserChoice;
