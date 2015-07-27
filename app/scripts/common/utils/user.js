'use strict';

var $ = require('jquery');
var config = require('../config');
var localforage = require('localforage');
var ivleNamespace = config.namespaces.ivle + ':';

var IVLE_LAPI_KEY = config.IVLE.LAPIKey;

module.exports = {
  ivleDialog: null,
  getIVLELoginStatus: function (callback) {
    if (!callback) {
      return;
    }
    localforage.getItem(ivleNamespace + 'user', function (userProfile) {
      if (userProfile && userProfile.UserID) {
        callback({
          loggedIn: true,
          userProfile: userProfile
        });  
      } else {
        callback({
          loggedIn: false
        });
      }
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
          localforage.setItem(ivleNamespace + 'user', data.Results[0]);
          var studentId = data.Results[0].UserID;
          callback({
            loggedIn: true,
            userProfile: data.Results[0]
          });
          $.get('https://ivle.nus.edu.sg/api/Lapi.svc/Modules_Taken', {
            'APIKey': IVLE_LAPI_KEY,
            'AuthToken': ivleToken,
            'StudentID': studentId
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
    localforage.removeItem(ivleNamespace + 'user');
    localforage.removeItem(ivleNamespace + 'ivleTaken');
    localforage.removeItem(ivleNamespace + 'modulesTaken');
  },
  getUser: function (callback) {
    if (!callback) {
      return;
    }
    localforage.getItem(ivleNamespace + 'user', function (user) {
      callback(user);
    });
  },
}
