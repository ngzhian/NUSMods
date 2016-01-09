'use strict';

var Marionette = require('backbone.marionette');
var template = require('../templates/profile.hbs');
var user = require('../../common/utils/user');

module.exports = Marionette.LayoutView.extend({
  template: template,
  events: {
    'click .js-login-ivle': 'login',
    'click .js-logout-ivle': 'logout'
  },
  login: function () {
    var that = this;
    user.loginIVLE(function (response) {
      that.updateProfile(response);
    });
  },
  logout: function () {
    user.logoutIVLE();
    this.updateProfile({ loggedIn: false });
  },
  onShow: function () {
    var that = this;
    user.getIVLELoginStatus(function (response) {
      that.updateProfile(response);
    });
  },
  updateProfile: function (response) {
    if (response.loggedIn) {
      this.model.set('userProfile', response.userProfile);
    }
    this.model.set('loggedIn', response.loggedIn);
    this.render();
  }
});
