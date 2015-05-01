'use strict';

var $ = require('jquery');
var Promise = require('bluebird'); // jshint ignore:line
var slugify = require('./common/utils/slugify.js');

var ayBaseUrl;
var moduleInformationPromise;
var moduleListPromise;
var timetablePromise;
var venuesPromise, venueInformationPromise;
var moduleCodes = {};
var moduleProjects = {};

module.exports = {
  getAllModules: function () {
    return moduleCodes;
  },
  generateModuleCodes: function () {
    moduleListPromise = moduleListPromise || Promise.resolve($.getJSON(ayBaseUrl + 'moduleList.json'));
    return moduleListPromise.then(function (data) {
      for (var i = 0; i < data.length; i++) {
        moduleCodes[data[i].ModuleCode] = data[i].ModuleTitle;
      }
    });
  },
  getLastModified: function (callback) {
    return Promise.resolve($.ajax(ayBaseUrl + 'modules.json', {
      type: 'HEAD'
    }).then(function (data, textStatus, jqXHR) {
      var lastModified = jqXHR.getResponseHeader('Last-Modified');
      if (callback) {
        callback(lastModified);
      }
      return lastModified;
    }));
  },
  getMod: function (code, callback) {
    return Promise.resolve($.getJSON(ayBaseUrl + 'modules/' + code + '.json', callback));
  },
  getModIndex: function (code, callback) {
    return Promise.resolve($.getJSON(ayBaseUrl + 'modules/' + code + '/index.json', callback));
  },
  getMods: function (callback) {
    moduleInformationPromise = moduleInformationPromise ||
      Promise.resolve($.getJSON(ayBaseUrl + 'moduleInformation.json'));
    return moduleInformationPromise.then(callback);
  },
  getAllTimetable: function (semester, callback) {
    timetablePromise = timetablePromise || Promise.resolve($.getJSON(ayBaseUrl + semester + '/timetable.json'));
    return timetablePromise.then(callback);
  },
  getTimetable: function (semester, code, callback) {
    return Promise.resolve($.getJSON(ayBaseUrl + semester + '/modules/' + code + '/timetable.json', callback));
  },
  getCodesAndTitles: function (callback) {
    moduleListPromise = moduleListPromise || Promise.resolve($.getJSON(ayBaseUrl + 'moduleList.json'));
    return moduleListPromise.then(callback);
  },
  getVenues: function (semester, callback) {
    venuesPromise = venuesPromise || Promise.resolve($.getJSON([ayBaseUrl, semester, 'venues.json'].join('/')));
    return venuesPromise.then(callback);
  },
  getVenueInformation: function (semester, callback) {
    venueInformationPromise = venueInformationPromise || Promise.resolve($.getJSON([ayBaseUrl, semester, 'venueInformation.json'].join('/')));
    return venueInformationPromise.then(callback);
  },
  setConfig: function (config) {
    ayBaseUrl = config.baseUrl + config.academicYear.replace('/', '-') + '/';
  },
  getModuleProjects: function (code, callback) {
    var PROJECTS_LIST_URL = 'http://localhost:8000/' + code + '.json';

    if (moduleProjects[code]) {
      callback(moduleProjects[code]);
    } else {
      $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: PROJECTS_LIST_URL,
        dataType: 'jsonp',
        jsonpCallback: 'callback',
        success: function (data) {
          // Inject module code into each project object
          data.forEach(function (item) {
            item.modCode = code;
            item.slug = slugify(item.title);
          });
          moduleProjects[code] = data;
          callback(data);
        }
      });
    }
  }
};
