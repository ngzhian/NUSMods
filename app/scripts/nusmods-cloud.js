'use strict';
// This module serves as a wrapper for the NUSMods Cloud API.
var $ = require('jquery');

var config = require('./common/config');
var userNamespace = config.namespaces.user + ':';
var API_HOST = require('./common/config').apiHost;

module.exports = {
  accessToken: null,
  setAccessToken: function (accessToken) {
    this.accessToken = accessToken;
  },
  removeAccessToken: function () {
    this.accessToken = null;
  },
  auth: function (ivleToken, callback) {
    var that = this;
    if (!callback) {
      return;
    }
    $.ajax({
      url: API_HOST + '/users',
      type: 'post',
      data: {
        ivleToken: ivleToken
      }
    }).done(function (response) {
      that.setAccessToken(response.data.accessToken);
      callback(response.data);
    }).fail(function () {
      alert('Something has went wrong. Please try again later.');
    });
  },
  updateTimetable: function (nusnetId, semester, queryString, callback, failCallback) {
    var that = this;
    $.ajax({
      url: API_HOST + '/users/' + nusnetId + '/timetables',
      type: 'post',
      headers: {
        Authorization: that.accessToken
      },
      data: {
        semester: semester,
        lessons: queryString
      }
    }).done(function (response) {
      if (callback) {
        callback(response.data);
      }
    }).fail(function () {
      alert('Something has went wrong. Please try again later.');
      if (failCallback) {
        failCallback(response.data);
      }
    });
  },
  getTimetable: function (nusnetId, semester, callback) {
    var that = this;
    $.ajax({
      url: API_HOST + '/users/' + nusnetId + '/timetables/' + semester,
      type: 'get',
      headers: {
        Authorization: that.accessToken
      }
    }).done(function (response) {
      if (callback) {
        callback(response.data.lessons);
      }
    }).fail(function () {
      alert('Something has went wrong. Please try again later.');
      if (failCallback) {
        failCallback(response.data);
      }
    });
  },
  getFriends: function (nusnetId, callback, failCallback) {
    $.ajax({
      url: API_HOST + '/users/' + nusnetId + '/friends',
      type: 'get',
      headers: {
        Authorization: that.accessToken
      }
    }).done(function (response) {
      if (callback) {
        callback(response.data);
      }
    }).fail(function () {
      alert('Something has went wrong. Please try again later.');
      if (failCallback) {
        failCallback(response.data);
      }
    });
  },
  getFriendsTimetable: function (nusnetId, callback, failCallback) {
    $.ajax({
      url: API_HOST + '/users/' + nusnetId + '/friends/timetable',
      type: 'get',
      headers: {
        Authorization: that.accessToken
      }
    }).done(function (response) {
      if (callback) {
        callback(response.data);
      }
    }).fail(function () {
      alert('Something has went wrong. Please try again later.');
      if (failCallback) {
        failCallback(response.data);
      }
    });
  },
  addFriend: function (nusnetId, friendNusnetId, callback) {
    return callback({
      status: 'success'
    });
  },
  unfriend: function (nusnetId, friendNusnetId, callback) {
    return callback({
      status: 'success'
    });
  },
  getPendingFriendRequestsReceived: function (nusnetId, callback) {
    return callback([
    {
      nusnetId: 'a0112345',
      name: 'HONG LU',
      email: 'honglu@u.nus.edu',
      gender: 'Female',
      faculty: 'Faculty of Science',
      firstMajor: 'Quantitative Finance (Hons)',
      secondMajor: '',
      matriculationYear: '2014'
    },
    {
      nusnetId: 'a0113615',
      name: 'LIU XINAN',
      email: 'xinan@u.nus.edu',
      gender: 'Male',
      faculty: 'School of Computing',
      firstMajor: 'Computer Science (Hons)',
      secondMajor: '',
      matriculationYear: '2014'
    },
    {
      nusnetId: 'a0111862',
      name: 'XU BILI',
      email: 'bili@u.nus.edu',
      gender: 'Male',
      faculty: 'School of Computing',
      firstMajor: 'Computer Science (Hons)',
      secondMajor: '',
      matriculationYear: '2014'
    }]);
  },
  getPendingFriendRequestsSent: function (nusnetId, callback) {
    return callback([
    {
      nusnetId: 'a0112345'
    },
    {
      nusnetId: 'a0113615'
    },
    {
      nusnetId: 'a0111862'
    }]);
  },
  acceptFriendRequest: function (nusnetId, friendNusnetId, callback) {
    return callback({
      status: 'success'
    });
  },
  rejectFriendRequest: function (nusnetId, friendNusnetId, callback) {
    return callback({
      status: 'success'
    });
  },
  cancelFriendRequest: function (nusnetId, friendNusnetId, callback) {
    return callback({
      status: 'success'
    });
  }
};
