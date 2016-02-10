'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var TimetableModuleCollection = require('../../common/collections/TimetableModuleCollection');
var SelectedModulesController = require('../../common/controllers/SelectedModulesController');

// Common terminology throughout project is to refer to lessons instead of
// classes, as class is a keyword in JavaScript.
module.exports = Backbone.Model.extend({
  initialize: function() {
    var selectedModules = TimetableModuleCollection.fromQueryStringToJSON(this.get('queryString'));
    // TODO: Change semester
    var that = this;
    var selectedModulesController = new SelectedModulesController({
      name: name,
      semester: this.get('semester'),
      saveOnChange: false
    });

    _.each(selectedModules, function(module) {
      selectedModulesController.selectedModules.add({
        ModuleCode: module.ModuleCode,
        Semester: that.get('semester')
      }, module);
    });

    this.set('moduleInformation', selectedModulesController.selectedModules);

    selectedModulesController.selectedModules.on('change', function() {
      that.trigger('change');
    });
  }
});
