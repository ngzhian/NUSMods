'use strict';

// This module serves as a wrapper for the NUSMods Cloud API.

var API_HOST = require('./common/config').apiHost;
var $ = require('jquery');

module.exports = {
  auth: function (ivleToken, callback) {
    if (!callback) {
      return;
    }
    $.post(API_HOST + '/users', {
      ivleToken: ivleToken
    }, function (response) {
      callback(response.data);
    });
  },
  updateTimetable: function (nusnetId, semester, queryString, callback) {
    return callback({
      status: 'success'
    });
  },
  getTimetable: function (nusnetId, year, semester, callback) {
    return callback({
      year: '2015-2016',
      semester: 1,
      queryString: 'CS3216[TUT]=1&CS3216[LEC]=1&CS3219[LEC]=1&CS3219[TUT]=1&CS2103[LEC]=1&CS2103[TUT]=1'
    });
  },
  getFriends: function (nusnetId, callback) {
    return callback([
    {
      nusnetId: 'a0112345',
      name: 'HONG LU',
      email: 'honglu@u.nus.edu',
      gender: 'Female',
      faculty: 'Faculty of Science',
      firstMajor: 'Quantitative Finance (Hons)',
      secondMajor: '',
      matriculationYear: '2014'
    },
    {
      nusnetId: 'a0113615',
      name: 'LIU XINAN',
      email: 'xinan@u.nus.edu',
      gender: 'Male',
      faculty: 'School of Computing',
      firstMajor: 'Computer Science (Hons)',
      secondMajor: '',
      matriculationYear: '2014'
    },
    {
      nusnetId: 'a0111862',
      name: 'XU BILI',
      email: 'bili@u.nus.edu',
      gender: 'Male',
      faculty: 'School of Computing',
      firstMajor: 'Computer Science (Hons)',
      secondMajor: '',
      matriculationYear: '2014'
    }]);
  },
  getFriendsTimetable: function (nusnetId, semester, callback) {
    return callback([
    {
      nusnetId: 'a0112345',
      name: 'HONG LU',
      email: 'honglu@u.nus.edu',
      gender: 'Female',
      faculty: 'Faculty of Science',
      firstMajor: 'Quantitative Finance (Hons)',
      secondMajor: '',
      matriculationYear: '2014',
      timetable: {
        year: '2015-2016',
        semester: 1,
        queryString: 'CS3210[TUT]=1&CS3210[LEC]=1&CS3216[TUT]=1&CS3216[LEC]=1&CS2105[LEC]=1&CS2105[TUT]=5&LAF3201[TUT]=T6&LAF3201[LEC]=1'
      }
    },
    {
      nusnetId: 'a0113615',
      name: 'LIU XINAN',
      email: 'xinan@u.nus.edu',
      gender: 'Male',
      faculty: 'School of Computing',
      firstMajor: 'Computer Science (Hons)',
      secondMajor: '',
      matriculationYear: '2014',
      timetable: {
        year: '2015-2016',
        semester: 1,
        queryString: 'CS3216[TUT]=1&CS3216[LEC]=1&CS2105[LEC]=1&CS2105[TUT]=5&CS2106[LAB]=2&CS2106[LEC]=1&CS2106[TUT]=7&CS3244[LEC]=1&CS3244[TUT]=1&CS2309[LEC]=1&CS2309[TUT]=2'
      }
    },
    {
      nusnetId: 'a0111862',
      name: 'XU BILI',
      email: 'bili@u.nus.edu',
      gender: 'Male',
      faculty: 'School of Computing',
      firstMajor: 'Computer Science (Hons)',
      secondMajor: '',
      matriculationYear: '2014',
      timetable: {
        year: '2015-2016',
        semester: 1,
        queryString: 'CS3216[TUT]=1&CS3216[LEC]=1&CS2103T[TUT]=C02&CS2101[SEC]=1&CS2104[LEC]=1&CS2104[TUT]=2&CS3230[LEC]=2'
      }
    }]);
  },
  addFriend: function (nusnetId, friendNusnetId, callback) {
    return callback({
      status: 'success'
    });
  },
  unfriend: function (nusnetId, friendNusnetId, callback) {
    return callback({
      status: 'success'
    });
  },
  getPendingFriendRequestsReceived: function (nusnetId, callback) {
    return callback([
    {
      nusnetId: 'a0112345',
      name: 'HONG LU',
      email: 'honglu@u.nus.edu',
      gender: 'Female',
      faculty: 'Faculty of Science',
      firstMajor: 'Quantitative Finance (Hons)',
      secondMajor: '',
      matriculationYear: '2014'
    },
    {
      nusnetId: 'a0113615',
      name: 'LIU XINAN',
      email: 'xinan@u.nus.edu',
      gender: 'Male',
      faculty: 'School of Computing',
      firstMajor: 'Computer Science (Hons)',
      secondMajor: '',
      matriculationYear: '2014'
    },
    {
      nusnetId: 'a0111862',
      name: 'XU BILI',
      email: 'bili@u.nus.edu',
      gender: 'Male',
      faculty: 'School of Computing',
      firstMajor: 'Computer Science (Hons)',
      secondMajor: '',
      matriculationYear: '2014'
    }]);
  },
  getPendingFriendRequestsSent: function (nusnetId, callback) {
    return callback([
    {
      nusnetId: 'a0112345'
    },
    {
      nusnetId: 'a0113615'
    },
    {
      nusnetId: 'a0111862'
    }]);
  },
  acceptFriendRequest: function (nusnetId, friendNusnetId, callback) {
    return callback({
      status: 'success'
    });
  },
  rejectFriendRequest: function (nusnetId, friendNusnetId, callback) {
    return callback({
      status: 'success'
    });
  },
  cancelFriendRequest: function (nusnetId, friendNusnetId, callback) {
    return callback({
      status: 'success'
    });
  }
};
