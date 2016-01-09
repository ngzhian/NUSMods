'use strict';

var $ = require('jquery');
var _ = require('underscore');
var localforage = require('localforage');
var Marionette = require('backbone.marionette');

var template = require('../templates/friends_requests_received_list_item.hbs');
var user = require('../../common/utils/user');

module.exports = Marionette.ItemView.extend({
  tagName: 'tr',
  className: 'media nm-friends-list-item',
  template: template,
  events: {
    'click .js-nm-friends-request-accept': 'acceptFriendRequest',
    'click .js-nm-friends-request-reject': 'rejectFriendRequest',
  },
  acceptFriendRequest: function (e) {
    e.preventDefault();
    e.stopPropagation();
    var that = this;
    var friendNusnetId = this.model.get('nusnetId');

    user.acceptFriendRequest(friendNusnetId).then(function (response) {
      if (response.status === 'success') {
        that.trigger('accept:friendRequest');
        that.removeFromFriendsList(that.model);
      } else {
        window.alert('Unable to accept friend request from ' + friendNusnetId);
      }
    });
  },
  rejectFriendRequest: function (e) {
    e.preventDefault();
    e.stopPropagation();
    var that = this;
    var friendNusnetId = this.model.get('nusnetId');
    var choice = window.confirm('Do you really want to reject the friend ' +
                                'request from ' + friendNusnetId + '?');
    if (choice) {
      user.rejectFriendRequest(friendNusnetId).then(function (response) {
        if (response.status === 'success') {
          that.removeFromFriendsList(that.model);
        } else {
          window.alert('Unable to reject friend request from ' + friendNusnetId);
        }
      });
    }
  },
  removeFromFriendsList: function (model) {
    var friendsListCollection = model.collection;
    friendsListCollection.remove(model);
    friendsListCollection.trigger('change');
  },
  onAcceptFriendRequest: function () {
    console.log('child', 'onAcceptFriendRequest');
  }
});
