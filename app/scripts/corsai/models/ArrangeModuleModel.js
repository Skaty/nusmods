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

  /*
    From main entry point for permutations in ArrangeModulesModel -
    recurses to here to calculate permutations for all the lesson types
  */
  permutations: function() {
    if (this.get('ArrangeLessonTypes') == null) {
      return 0;
    } else {
      return this.get('ArrangeLessonTypes').reduce(function(memo, lessonType) {
        return memo * lessonType.permutations();
      }, 1);
    }
  },

  /*
    Recursively removes redundant lessons for each lesson type.
    Mutates the internal lists to do this
  */
  removeRedundantLessons: function() {
    if (this.get('ArrangeLessonTypes') == null) {
      return 0;
    } else {
      return this.get('ArrangeLessonTypes').each(function(lessonType) {
        lessonType.removeRedundantLessons();
      });
    }
  }

});
