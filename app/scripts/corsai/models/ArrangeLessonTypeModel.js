'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var ArrangeClassNoCollection = require('../collections/ArrangeClassNoCollection');
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

      // gets the unique classes from the class list
      // essentially removes lesson slots that have the same day, start and end time
      // and are same odd/even week/all week - but just have a different venue
      var uniqueClassNos = _.uniq(classNos.models, false, function(classNo) {
        return classNo.get('Lessons')[0].StartTime +
                ' ' +
                classNo.get('Lessons')[0].EndTime +
                ' ' +
                classNo.get('Lessons')[0].WeekText +
                ' ' +
                classNo.get('Lessons')[0].DayText;
      });

      console.log('Uniques');
      console.log(uniqueClassNos);


      // Create a new collection to hold these unique classNos
      var newArrangeClassNos = new ArrangeClassNoCollection();
      // add whole array to collection
      newArrangeClassNos.add(uniqueClassNos);

      // update to unique class nos.
      this.set('ArrangeClassNos', newArrangeClassNos);

    }
  }

});
