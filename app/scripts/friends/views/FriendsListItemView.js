'use strict';

var $ = require('jquery');
var _ = require('underscore');
var localforage = require('localforage');
var Marionette = require('backbone.marionette');

var template = require('../templates/friends_list_item.hbs');
var user = require('../../common/utils/user');

module.exports = Marionette.ItemView.extend({
  tagName: 'tr',
  className: 'media nm-friends-list-item',
  template: template,
  events: {
    'click .nm-friends-name': 'selectFriend',
    'click .js-nm-friends-unfriend': 'unfriend',
    'change .js-nm-friends-select-checkbox': 'toggleFriendSelection'
  },
  selectFriend: function () {
    _.each(this.model.collection.models, function (model) {
      model.set('selected', false);
    });
    this.model.set('selected', true);
  },
  toggleFriendSelection: function (e) {
    e.preventDefault();
    e.stopPropagation();
    var selected = this.model.get('selected');
    this.model.set('selected', !selected);
  },
  unfriend: function (e) {
    e.preventDefault();
    e.stopPropagation();
    var that = this;
    var friendNusnetId = this.model.get('nusnetId');
    var choice = window.confirm('Are you sure about removing ' + this.model.get('name') + 
                                ' from your friends?');
    
    if (choice) {
      user.unfriend(friendNusnetId).then(function (result) {
        if (result.status === 'success') {
          var friendsListCollection = that.model.collection;
          friendsListCollection.remove(that.model);
          friendsListCollection.trigger('change');
        }
      });
    }
  }
});
