'use strict';

var App = require('../app');
var Marionette = require('backbone.marionette');

var navigationItem = App.request('addNavigationItem', {
  name: 'Friends',
  icon: 'users',
  url: '/friends'
});

var controller = {
  showFriendsTimetable: function () {
    var FriendsTimetableView = require('./views/FriendsTimetableView');
    navigationItem.select();
    App.mainRegion.show(new FriendsTimetableView());
  },
  showFriendsManagement: function () {
    var FriendsManagementView = require('./views/FriendsManagementView');
    navigationItem.select();
    App.mainRegion.show(new FriendsManagementView());
  }
};

App.addInitializer(function () {
  new Marionette.AppRouter({
    controller: controller,
    appRoutes: {
      'friends': 'showFriendsTimetable',
      'friends_management': 'showFriendsManagement'
    }
  });
});
