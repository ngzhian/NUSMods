'use strict';

var App = require('../app');
var Marionette = require('backbone.marionette');

var navigationItem = App.request('addNavigationItem', {
  name: 'Friends',
  icon: 'users',
  url: '/friends'
});

var controller = {
  showFriends: function () {
    var FriendsView = require('./views/FriendsView');
    navigationItem.select();
    App.mainRegion.show(new FriendsView());
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
      'friends': 'showFriends',
      'friends_management': 'showFriendsManagement'
    }
  });
});
