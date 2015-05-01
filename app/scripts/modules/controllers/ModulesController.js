'use strict';

var App = require('../../app');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var ProjectView = require('../views/ProjectView');

var navigationItem = App.request('addNavigationItem', {
  name: 'Modules',
  icon: 'search',
  url: '/modules'
});

module.exports = Marionette.Controller.extend({
  showModules: function (id, projectSlug) {
    var ModulesView = require('../views/ModulesView');
    var ModuleView = require('../views/ModuleView');
    var NUSMods = require('../../nusmods');
    var ModuleModel = require('../../common/models/ModuleModel');
    var ModulePageModel = require('../models/ModulePageModel');
    var facultyList = require('../../common/faculty/facultyList.json');
    navigationItem.select();
    if (!id) {
      NUSMods.getMods().then(function (mods) {
        App.mainRegion.show(new ModulesView({mods: mods}));
      });
    } else if (projectSlug) {
      var modCode = id.toUpperCase();
      NUSMods.getMods(modCode).then(function (data) {
        App.mainRegion.show(new ProjectView({
          model: new Backbone.Model({
            modCode: modCode,
            projectSlug: projectSlug
          })
        }));
      });
    } else {
      var modCode = id.toUpperCase();
      NUSMods.getMod(modCode).then(function (data) {
        var moduleModel = new ModuleModel(data);
        var modulePageModel = new ModulePageModel({
          faculties: facultyList,
          module: moduleModel.attributes
        });
        App.mainRegion.show(new ModuleView({model: modulePageModel}));
      });
    }
  }
});
