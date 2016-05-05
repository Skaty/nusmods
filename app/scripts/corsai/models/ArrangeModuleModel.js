'use strict';

var Backbone = require('backbone');

/*
  Each ArrangeModule contains all lessons for that module - organized
  by lesson type. ArrangeLessonTypes contains a list of ArrangeLessonType
  models which each contain the lessons under that lesson type
*/

module.exports = Backbone.Model.extend({
  defaults: {
    ArrangeLessonTypes: null,
    ModuleCode: null
  },

  initialize: function () {

  }

});
