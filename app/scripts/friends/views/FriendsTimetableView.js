'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var localforage = require('localforage');

var template = require('../templates/friends_timetable.hbs');
var addFriendTimetableModalTemplate = require('../templates/friend_add_modal.hbs');
var timify = require('../../common/utils/timify');
var TimetableFlexView = require('../../timetable_flex/views/TimetableFlexView');
var FriendsListView = require('./FriendsListView');
var FriendsSelectedListView = require('./FriendsSelectedListView');
var FriendModel = require('../models/FriendModel');
var FriendsNotGoingSchoolView = require('./FriendsNotGoingSchoolView');
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
    friendsSelectedListRegion: '.nm-friends-selected-list',
    friendsNotGoingSchoolRegion: '.nm-friends-not-going-school',
    timetableRegion: '.nm-friends-timetable'
  },
  ui: {
    'addButton': '.js-nm-friends-add-button'
  },
  onShow: function () {

    var that = this;
    var userTimetableUrl;
    localforage.getItem(config.semTimetableFragment(config.semester) + ':queryString').then(function (data) {
      userTimetableUrl = data;
    }).then(function () {
      user.getFriendsTimetable().then(function (data) {
        
        // Get current user's information
        var userProfile = user.userProfile;
        userProfile.timetable = {
          year: '2015-2016',
          semester: config.semester,
          queryString: userTimetableUrl
        };
        userProfile.selected = true; // Display own timetable on initial load

        if (!data) {
          data = [userProfile];
        } else {
          data.unshift(userProfile);
        }

        var friendsList = _.map(data, function (friend) {
          friend.timetableMode = true;
          return new FriendModel(friend);
        });
        that.friendsListCollection = new Backbone.Collection(friendsList);
        that.friendsListView = new FriendsListView({collection: that.friendsListCollection});
        that.friendsListRegion.show(that.friendsListView);

        var friendsSelectedList = that.friendsListCollection.where({selected: true});
        that.friendsSelectedListView = new FriendsSelectedListView();
        that.friendsSelectedListView.collection = new Backbone.Collection(friendsSelectedList);
        that.friendsSelectedListRegion.show(that.friendsSelectedListView);
        that.showSelectedFriendsList();
        that.updateDisplayedTimetable();

        that.friendsListCollection.on('change', function () {
          var friendsSelectedList = that.friendsListCollection.where({selected: true});
          that.friendsSelectedListView.collection = new Backbone.Collection(friendsSelectedList);
          that.updateDisplayedTimetable();
          that.showSelectedFriendsList();
          that.friendsListView.render();
        });
      });
    });

    this.ui.addButton.popover({
      html: true,
      placement: 'bottom',
      content: addFriendTimetableModalTemplate()
    });
  },
  events: {
    'click .js-nm-friends-add': 'addFriend',
    'click .js-nm-friends-select-all': 'selectAllFriends'
  },
  showSelectedFriendsList: function () {
    this.friendsSelectedListView.render();
  },
  addFriend: function () {
    var that = this;
    var friendNusnetId = $('#matric-num').val();
    if (friendNusnetId.length === 0) {
      // TODO: Do some basic validation
      alert('Non-empty value required!');
      return;
    } else {
      user.addFriend(friendNusnetId).then(function (response) {
        if (response.status === 'success') {
          alert('Friend request sent to ' + friendNusnetId);
          that.ui.addButton.popover('hide');
        }
      });
    }
  },
  selectAllFriends: function () {
    var selectedAll = this.model.get('selectedAll');
    this.model.set('selectedAll', !selectedAll);
    _.each(this.friendsListCollection.models, function (person) {
      person.set('selected', !selectedAll);
    });
  },
  updateDisplayedTimetable: function () {

    var people = _.map(this.friendsSelectedListView.collection.models, function (person) {
      return person.get('name');
    });

    var daysNotGoingToSchool = {};
    _.each(timify.getSchoolDays(), function (day) {
      daysNotGoingToSchool[day] = people;
    });

    var combinedLessons = _.map(this.friendsSelectedListView.collection.models, function (person) {
      return _.map(person.get('moduleInformation').timetable.models, function (lesson) {
        var personName = person.get('name');
        lesson.attributes.name = personName;
        var dayText = lesson.attributes.DayText;
        daysNotGoingToSchool[dayText] = _.without(daysNotGoingToSchool[dayText], personName);
        return lesson.attributes;
      });
    });

    var daysNotGoingToSchoolList = _.map(timify.getSchoolDays(), function (day) {
      return {
        day: day,
        peopleNotGoingList: daysNotGoingToSchool[day],
        peopleNotGoing: daysNotGoingToSchool[day].join(', ')
      };
    });

    var haveSchoolEveryday = true;
    _.each(timify.getWeekDays(), function (day) {
      if (daysNotGoingToSchool[day].length > 0) {
        haveSchoolEveryday = false;
      }
    });

    if (daysNotGoingToSchool.Saturday.length === people.length) {
      // By default, hide Saturday if everyone not going on Saturday
      daysNotGoingToSchoolList.splice(5, 1);
    }

    var notGoingSchoolModel = new Backbone.Model({
      daysNotGoingToSchool: daysNotGoingToSchoolList,
      haveSchoolEveryday: haveSchoolEveryday
    });

    
    this.friendsNotGoingSchoolRegion.show(new FriendsNotGoingSchoolView({
      model: notGoingSchoolModel,
    }));

    combinedLessons = _.reduce(combinedLessons, function (a, b) {
      return a.concat(b);
    }, []);

    var isMergeMode = this.friendsSelectedListView.collection.models.length > 1;

    var timetableFlexModel = new Backbone.Model({
      lessonsList: combinedLessons,
      mergeMode: isMergeMode
    });

    this.timetableRegion.show(new TimetableFlexView({
      model: timetableFlexModel
    }));
  }
});
