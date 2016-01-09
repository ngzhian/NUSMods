'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');

var template = require('../templates/friends_management.hbs');
var addFriendTimetableModalTemplate = require('../templates/friend_add_modal.hbs');
var FriendsListView = require('./FriendsListView');
var FriendsRequestsReceivedListView = require('./FriendsRequestsReceivedListView');
var FriendsRequestsSentListView = require('./FriendsRequestsSentListView');
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
    friendsRequestsSentListRegion: '.nm-friends-requests-sent-list',
    friendsRequestsReceivedListRegion: '.nm-friends-requests-received-list',
  },
  ui: {
    'addButton': '.js-nm-friends-add-button'
  },
  events: {
    'click .js-nm-friends-add': 'addFriend'
  },
  onShow: function () {
    var that = this;

    this.renderFriendsListRegion();

    this.renderFriendsRequestsSentListRegion();

    that.friendsRequestsReceivedListView = new FriendsRequestsReceivedListView();
    this.renderFriendsRequestsReceivedListRegion();

    this.listenTo(that.friendsRequestsReceivedListView, 'accept:friendRequest', 
                  this.renderFriendsListRegion);

    this.ui.addButton.popover({
      html: true,
      placement: 'bottom',
      content: addFriendTimetableModalTemplate()
    });
  },
  addFriend: function () {
    var that = this;
    var friendNusnetId = $('#matric-num').val();
    if (friendNusnetId.length === 0) {
      alert('Non-empty value required!');
      return;
    } else {
      user.addFriend(friendNusnetId).then(function (response) {
        if (response.status === 'success') {
          alert('Friend request sent to ' + friendNusnetId);
          that.ui.addButton.popover('hide');
          that.renderFriendsRequestsSentListRegion();
        }
      });
    }
  },
  showSelectedFriendsList: function () {
    this.friendsSelectedListView.render();
  },
  renderFriendsListRegion: function () {
    var that = this;
    user.getFriends().then(function (data) {
      var friendsList = _.map(data, function (friend) {
        return new FriendModel(friend);
      });
      that.friendsListView = new FriendsListView({
        collection: new Backbone.Collection(friendsList)
      });
      that.friendsListRegion.show(that.friendsListView);
    });
  },
  renderFriendsRequestsSentListRegion: function () {
    var that = this;
    user.getPendingFriendRequestsSent().then(function (data) {
      var friendsList = _.map(data, function (friend) {
        return new FriendModel(friend);
      });
      that.friendsRequestsSentListView = new FriendsRequestsSentListView({
        collection: new Backbone.Collection(friendsList)
      });
      that.friendsRequestsSentListRegion.show(that.friendsRequestsSentListView);
    });
  },
  renderFriendsRequestsReceivedListRegion: function () {
    //  Do not do a full re-render because parent view is listening 
    //  to `accept:friendRequest` event.
    var that = this;
    user.getPendingFriendRequestsReceived().then(function (data) {
      var friendsList = _.map(data, function (friend) {
        return new FriendModel(friend);
      });
      that.friendsRequestsReceivedListView.collection = new Backbone.Collection(friendsList);
      that.friendsRequestsReceivedListRegion.show(that.friendsRequestsReceivedListView);
    });
  }
});
