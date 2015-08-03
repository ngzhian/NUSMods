'use strict';

var _ = require('underscore');
var Marionette = require('backbone.marionette');
var FriendsRequestsReceivedListItemView = require('./FriendsRequestsReceivedListItemView');

var EmptyView = Marionette.ItemView.extend({
  template: _.template('<tr><td>No pending friend requests received.</td></tr>')
});

module.exports = Marionette.CollectionView.extend({
  tagName: 'tbody',
  emptyView: EmptyView,
  childView: FriendsRequestsReceivedListItemView,
  childEvents: {
    'accept:friendRequest': function () {
      this.trigger('accept:friendRequest');
    }
  }
});
