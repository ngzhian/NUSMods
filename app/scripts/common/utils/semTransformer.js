'use strict';

// Used to convert NUSMods cloud semester to acad year and sem
module.exports = {
  cloudSemToNUSModsYearSem: function (semester) {
    var fragments = semester.split('sem');
    return {
      semester: parseInt(fragments[1]),
      year: fragments[0]
    };
  },
  NUSModsYearSemToCloudSem: function (year, semester) {
    return year.replace('/', '-') + '/sem' + semester;
  }
};

