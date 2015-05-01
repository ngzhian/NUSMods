'use strict';

var Marionette = require('backbone.marionette');
var template = require('../templates/project_gallery_item.hbs');
var videoParser = require('../../common/utils/videoParser.js');

module.exports = Marionette.ItemView.extend({
  tagName: 'div',
  className: 'col-sm-6',
  template: template,
  onShow: function () {
    var videoUrl = this.model.get('videos')[0];
    var that = this;
    videoParser.getVideoThumbnail(videoUrl, function (thumbnail) {
      that.model.set('thumbnail', thumbnail);
      that.render();
    });
  }
});
