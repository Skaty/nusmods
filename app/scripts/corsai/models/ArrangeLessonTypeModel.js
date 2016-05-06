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

  permutations: function() {
    if (this.get('ArrangeClassNos') == null) {
      console.log("undefined ArrangeClassNos");
      return 0;
    } else {
      console.log("Class Nos Length: " + this.get('ArrangeClassNos').length)
      return this.get('ArrangeClassNos').length;
    }
  }

});
