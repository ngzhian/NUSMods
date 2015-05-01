'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var template = require('../templates/project.hbs');
var ProjectsListView = require('./ProjectsListView');
var ProjectContentView = require('./ProjectContentView');
var NUSMods = require('../../nusmods');

module.exports = Marionette.LayoutView.extend({
  template: template,
  regions: {
    projectContentRegion: '.nm-module-projects-content-container',
    projectsListRegion: '.nm-module-projects-list-container'
  },
  onShow: function () {
    var that = this;
    var modCode = this.model.get('modCode');

    NUSMods.getModuleProjects(modCode, function (data) {
      var project = _.filter(data, function (proj) {
        return proj.slug === that.model.get('projectSlug');
      })[0];
      var projectContentView = new ProjectContentView({
        model: new Backbone.Model(project)
      });
      that.projectContentRegion.show(projectContentView);

      var projectsListView = new ProjectsListView({
        collection: new Backbone.Collection(data)
      });

      that.projectsListRegion.show(projectsListView);
    });
  }
});
