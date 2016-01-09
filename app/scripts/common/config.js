'use strict';

var _ = require('underscore');
var applicationConfig = require('../../config/application.json');
var secretsConfig = require('../../config/secrets.json');

//  Merges application.json and secrets.json together
//  along with a semTimetableFragment function
module.exports = _.extend({}, {
    semTimetableFragment: function (semester) {
      return 'timetable/' + applicationConfig.academicYear.replace('/', '-') +
              '/sem' + (semester || applicationConfig.semester);
    },
    currentSemester: applicationConfig.academicYear.replace('/', '-') + '/sem' + applicationConfig.semester
  }, applicationConfig, secretsConfig);
