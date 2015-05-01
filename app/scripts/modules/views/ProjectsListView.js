'use strict';

var _ = require('underscore');
var Marionette = require('backbone.marionette');
var ProjectsListItemView = require('./ProjectsListItemView.js');

var EmptyView = Marionette.ItemView.extend({
  template: _.template('<div class="col-md-12">Loading...<br></div>')
});

module.exports = Marionette.CompositeView.extend({
  className: 'nm-module-projects-list',
  childView: ProjectsListItemView,
  childViewContainer: 'div',
  emptyView: EmptyView,
  template: _.template('<div class="row"></div>')
});
