'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var _ = require('underscore');
var localforage = require('localforage');
var template = require('../templates/preferences.hbs');
var themePicker = require('../../common/themes/themePicker');
var config = require('../../common/config');
var preferencesNamespace = config.namespaces.preferences + ':';
var ivleNamespace = config.namespaces.ivle + ':';
var ProfileView = require('./ProfileView');

module.exports = Marionette.LayoutView.extend({
  template: template,
  regions: {
    profileRegion: '#profile',
  },
  ui: {
    faculty: '#faculty',
    student: 'input:radio[name="student-radios"]',
    mode: 'input:radio[name="mode-radios"]',
    theme: '#theme-options'
  },
  initialize: function () {
    // TODO: Populate default values of form elements for first time users.
    _.each(this.ui, function (selector, item) {
      localforage.getItem(preferencesNamespace + item, function (value) {
        if (value) {
          $(selector).val([value]);
        }
      });
    });
  },
  events: {
    'click .random-theme': 'randomTheme',
    'change @ui.faculty, @ui.student, @ui.mode, @ui.theme': 'updatePreference',
    'keydown': 'toggleTheme'
  },
  onShow: function () {
    var that = this;
    this.profileRegion.show(new ProfileView({
      model: new Backbone.Model()
    }));
  },
  randomTheme: function () {
    themePicker.selectRandomTheme();
  },
  updatePreference: function ($ev) {
    var $target = $($ev.target);
    $target.blur();
    var property = $target.attr('data-pref-type');
    var value = $target.val();
    this.savePreference(property, value);
  },
  savePreference: function (property, value) {
    if (property === 'faculty' && value === 'default') {
      window.alert('You have to select a faculty.');
      localforage.getItem(preferencesNamespace + property, function (value) {
        $('#faculty').val(value);
      });
      return;
    }
    localforage.setItem(preferencesNamespace + property, value);
    if (property === 'theme') {
      themePicker.applyTheme(value);
    } else if (property === 'mode') {
      themePicker.toggleMode();
    }
  }
});
