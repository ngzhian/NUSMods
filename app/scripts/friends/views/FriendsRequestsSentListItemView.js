'use strict';

var $ = require('jquery');
var _ = require('underscore');
var localforage = require('localforage');
var Marionette = require('backbone.marionette');

var template = require('../templates/friends_requests_sent_list_item.hbs');
var user = require('../../common/utils/user');

module.exports = Marionette.ItemView.extend({
  tagName: 'tr',
  className: 'media nm-friends-list-item',
  template: template,
  events: {
    'click .js-nm-friends-request-cancel': 'cancelFriendRequest',
  },
  cancelFriendRequest: function (e) {
    e.preventDefault();
    e.stopPropagation();
    var that = this;
    var friendNusnetId = this.model.get('nusnetId');
    var choice = window.confirm('Do you really want to cancel your friend ' +
                                'request to ' + friendNusnetId + '?');
    if (choice) {
      user.cancelFriendRequest(friendNusnetId).then(function (response) {
        if (response.status === 'success') {
          var friendsListCollection = that.model.collection;
          friendsListCollection.remove(that.model);
          friendsListCollection.trigger('change');
        } else {
          window.alert('Unable to cancel friend request to ' + friendNusnetId);
        }
      });
    }
  }
});
