'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');

var template = require('../templates/friends_management.hbs');
var addFriendTimetableModalTemplate = require('../templates/friend_add_modal.hbs');
var FriendsListView = require('./FriendsListView');
var FriendModel = require('../models/FriendModel');
var config = require('../../common/config');
var user = require('../../common/utils/user');

require('bootstrap/tooltip');
require('bootstrap/popover');

module.exports = Marionette.LayoutView.extend({
  initialize: function () {
    this.model = new Backbone.Model({
      selectedAll: false
    });
  },
  template: template,
  regions: {
    friendsListRegion: '.nm-friends-list',
    friendsPendingRequestsSentListRegion: '.nm-friends-pending-requests-sent-list',
    friendsPendingRequestsReceivedListRegion: '.nm-friends-pending-requests-received-list',
  },
  ui: {
    'addButton': '.js-nm-friends-add-button'
  },
  onShow: function () {

    var that = this;
    user.getFriends(function (data) {
      var friendsList = _.map(data, function (friend) {
        return new FriendModel(friend);
      });
      that.friendsListCollection = new Backbone.Collection(friendsList);
      that.friendsListView = new FriendsListView({collection: that.friendsListCollection});
      that.friendsListRegion.show(that.friendsListView);
    });

    user.getPendingFriendRequestsSent(function (data) {
      var friendsList = _.map(data, function (friend) {
        return new FriendModel(friend);
      });
      that.friendsListCollection = new Backbone.Collection(friendsList);
      that.friendsListView = new FriendsListView({collection: that.friendsListCollection});
      that.friendsPendingRequestsSentListRegion.show(that.friendsListView);
    });

    user.getPendingFriendRequestsReceived(function (data) {
      var friendsList = _.map(data, function (friend) {
        return new FriendModel(friend);
      });
      that.friendsListCollection = new Backbone.Collection(friendsList);
      that.friendsListView = new FriendsListView({collection: that.friendsListCollection});
      that.friendsPendingRequestsReceivedListRegion.show(that.friendsListView);
    });

    this.ui.addButton.popover({
      html: true,
      placement: 'bottom',
      content: addFriendTimetableModalTemplate()
    });
  },
  events: {
    'click .js-nm-friends-add': 'addFriendTimetable',
    'click .js-nm-friends-select-all': 'selectAllFriends'
  },
  showSelectedFriendsList: function () {
    this.friendsSelectedListView.render();
  }
});
