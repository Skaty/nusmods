'use strict';

var Backbone = require('backbone');

/*
  Each ArrangeModule contains all lessons for that module - organized
  by lesson type. ArrangeLessonTypes contains a collection of ArrangeLessonType
  models which each contain the lessons under that lesson type
*/

module.exports = Backbone.Model.extend({
  defaults: {
    ArrangeLessonTypes: null,
    ModuleCode: null
  },

  initialize: function () {

  },

  permutations: function() {
    if (this.get('ArrangeLessonTypes') == null) {
      console.log("undefined ArrangeLessonTypes");
      return 0;
    } else {
      return this.get('ArrangeLessonTypes').reduce(function(memo, lesson_type) {
        console.log("Lesson_type perm: " + lesson_type.permutations());
        return memo * lesson_type.permutations();
      }, 1)
    }
  }

});
