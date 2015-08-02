'use strict';

var $ = require('jquery');
var Promise = require('bluebird'); // jshint ignore:line

var config = require('../config');
var localforage = require('localforage');

var nusmodsCloud = require('../../nusmods-cloud');
var ivleNamespace = config.namespaces.ivle + ':';

var IVLE_LAPI_KEY = config.IVLE.LAPIKey;

module.exports = {
  ivleDialog: null,
  userProfile: null,
  getIVLELoginStatus: function (callback) {
    var that = this;
    console.log('getIVLELoginStatus')
    localforage.getItem(ivleNamespace + 'user').then(function (userProfile) {
      console.log('obtainedUserProfile');
      if (userProfile && userProfile.nusnetId) {
        that.userProfile = userProfile;
        return callback ? callback({
          loggedIn: true,
          userProfile: userProfile
        }) : null;
      } else {
        return callback ? callback({
          loggedIn: false
        }) : null;
      });
    });
  },
  loginIVLE: function (callback) {
    var that = this;
    if (that.ivleDialog === null || that.ivleDialog.closed) {
      var w = 255;
      var h = 210;
      var left = (screen.width / 2) - (w / 2);
      var top = (screen.height / 3) - (h / 2);
      var options = 'dependent, toolbar=no, location=no, directories=no, ' +
                    'status=no, menubar=no, scrollbars=no, resizable=no, ' +
                    'copyhistory=no, width=' + w + ', height=' + h +
                    ', top=' + top + ', left=' + left;

      window.ivleLoginSuccessful = function (ivleToken) {
        localforage.setItem(ivleNamespace + 'ivleToken', ivleToken);
        $.get('https://ivle.nus.edu.sg/api/Lapi.svc/Profile_View', {
          'APIKey': IVLE_LAPI_KEY,
          'AuthToken': ivleToken
        }, function (data) {
          var ivleUserProfile = data.Results[0];
          var userProfile = {
            nusnetId: ivleUserProfile.UserID,
            name: ivleUserProfile.Name,
            email: ivleUserProfile.Email,
            gender: ivleUserProfile.Gender,
            faculty: ivleUserProfile.Faculty,
            firstMajor: ivleUserProfile.FirstMajor,
            secondMajor: ivleUserProfile.SecondMajor,
            matriculationYear: ivleUserProfile.MatriculationYear
          };
          localforage.setItem(ivleNamespace + 'user', userProfile);
          var nusnetId = userProfile.nusnetId;
          that.userProfile = userProfile;
          callback({
            loggedIn: true,
            userProfile: userProfile
          });
          $.get('https://ivle.nus.edu.sg/api/Lapi.svc/Modules_Taken', {
            'APIKey': IVLE_LAPI_KEY,
            'AuthToken': ivleToken,
            'StudentID': nusnetId
          }, function (data) { 
            localforage.setItem(ivleNamespace + 'modulesTaken', data);
          }, 'jsonp');
        }, 'jsonp');
        window.ivleLoginSuccessful = undefined;
      };

      var callbackUrl = window.location.protocol + '//' + window.location.host + '/ivlelogin.html';
      var popUpUrl = 'https://ivle.nus.edu.sg/api/login/?apikey=' + IVLE_LAPI_KEY + '&url=' + callbackUrl;
      that.ivleDialog = window.open(popUpUrl, '', options);
    } else {
      that.ivleDialog.focus();
    }
  },
  logoutIVLE: function () {
    this.userProfile = null;
    localforage.removeItem(ivleNamespace + 'user');
    localforage.removeItem(ivleNamespace + 'ivleTaken');
    localforage.removeItem(ivleNamespace + 'modulesTaken');
  },
  getUser: function (callback) {
    if (!callback) {
      return;
    }
    if (this.userProfile) {
      return callback(userProfile);
    }
    localforage.getItem(ivleNamespace + 'user', function (userProfile) {
      callback(userProfile);
    });
  },
  getFriends: function (callback) {
    if (!this.userProfile) {
      alert('Login first!');
      return;
    }
    nusmodsCloud.getFriends(this.userProfile.nusnetId, callback);
  },
  getFriendsTimetable: function (callback) {
    console.log('getFriendsTimetable');
    if (!this.userProfile) {
      alert('Login first!');
      return;
    }
    nusmodsCloud.getFriendsTimetable(this.userProfile.nusnetId, '2015-2016/sem1', callback);
  },
  getPendingFriendRequestsReceived: function (callback) {
    console.log('getPendingFriendRequestsReceived');
    if (!this.userProfile) {
      alert('Login first!');
      return;
    }
    nusmodsCloud.getPendingFriendRequestsReceived(this.userProfile.nusnetId, callback);
  },
  getPendingFriendRequestsSent: function (callback) {
    console.log('getPendingFriendRequestsSent');
    if (!this.userProfile) {
      alert('Login first!');
      return;
    }
    nusmodsCloud.getPendingFriendRequestsSent(this.userProfile.nusnetId, callback);
  }

}
