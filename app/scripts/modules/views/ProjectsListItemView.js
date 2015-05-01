'use strict';

var Marionette = require('backbone.marionette');
var template = require('../templates/project_item.hbs');

module.exports = Marionette.ItemView.extend({
  tagName: 'div',
  className: 'col-md-6',
  template: template
});
