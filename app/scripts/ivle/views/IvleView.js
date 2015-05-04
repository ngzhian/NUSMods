'use strict';

var Marionette = require('backbone.marionette');
var template = require('../templates/ivle.hbs');
var IvleApp = require('./IvleApp');

module.exports = Marionette.LayoutView.extend({
  template: template,
  onShow: function () {
    IvleApp.initialize();
  }
});
