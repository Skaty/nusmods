'use strict';

var Backbone = require('backbone');

/*
  Each ArrangeLessonType contains all lessons under a particular lesson type
  for a particular module. ArrangeClassNos contains a collection of lessons
  organized by their class number.
*/
module.exports = Backbone.Model.extend({
  defaults: {
    ArrangeClassNos: null,
    LessonType: null,
    ModuleCode: null
  },

  initialize: function () {

  },

  /*
    End-point for permutation calculations - just returns
    the number of classes - will be multiplied later to get
    the overall number of permutations
  */
  permutations: function() {
    if (this.get('ArrangeClassNos') == null) {
      return 0;
    } else {
      return this.get('ArrangeClassNos').length;
    }
  },

  /*
    Looks at all the class numbers and removes those
    that are redundant - i.e. the only thing that differs
    is the venue
  */
  removeRedundantLessons: function() {
    if (this.get('ArrangeClassNos') == null) {
      return 0;
    } else {
      var classNos = this.get('ArrangeClassNos');
      console.log(classNos);
    }
  }

});
