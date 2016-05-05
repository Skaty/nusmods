'use strict';

var Backbone = require('backbone');

/*
  Each ArrangeClassNo contains all lessons under a particular class number and
  particular lesson type
  for a particular module. Lessons contains the list of lessons that satisfy
  this requirement
*/

module.exports = Backbone.Model.extend({
  defaults: {
    ClassNo: null,
    LessonType: null,
    ModuleCode: null,
    Lessons: null
  },

  initialize: function () {

  }

});
