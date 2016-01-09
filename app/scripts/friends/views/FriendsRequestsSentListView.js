'use strict';

var _ = require('underscore');
var Marionette = require('backbone.marionette');
var FriendsRequestsSentListItemView = require('./FriendsRequestsSentListItemView');

var EmptyView = Marionette.ItemView.extend({
  template: _.template('<tr><td>No pending friend requests sent.</td></tr>')
});

module.exports = Marionette.CollectionView.extend({
  tagName: 'tbody',
  emptyView: EmptyView,
  childView: FriendsRequestsSentListItemView
});
