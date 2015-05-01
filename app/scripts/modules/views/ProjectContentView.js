'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var template = require('../templates/project_content.hbs');
var videoParser = require('../../common/utils/videoParser.js');

module.exports = Marionette.LayoutView.extend({
  template: template,
  initialize: function () {
    this.model.set('videoUrl', videoParser.getVideoEmbedUrl(this.model.get('videos')[0]));
  },
  onShow: function () {
    var that = this;
    function resizeVideo () {
      console.log('resize')
      $('.nm-project-video').height(parseInt($('.nm-project-video').width() * 9 / 16));  
    }
    $(window).resize(resizeVideo);
    resizeVideo();
  },
  onBeforeDestroy: function () {
    $(window).off('resize');
  }
});
