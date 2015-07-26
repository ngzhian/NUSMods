'use strict';

var Marionette = require('backbone.marionette');
var template = require('../templates/profile.hbs');

module.exports = Marionette.LayoutView.extend({
  template: template,
  events: {
    'click .js-fb-connect': 'connectFacebook'
  },
  connectFacebook: function () {
    var that = this;
    // user.toggleFacebookLogin(function (response) {
    //   that.model.set('loggedIn', response.loggedIn);
    //   if (response.loggedIn) {
    //     that.model.set('name', response.name);
    //     that.model.set('facebookId', response.facebookId);
    //   } 
    //   that.render();
    // });
  }
});
