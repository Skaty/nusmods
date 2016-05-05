'use strict';

var Backbone = require('backbone');

/*
  Each ArrangeLessonType contains all lessons under a particular lesson type
  for a particular module. ClassNos contains the list of lessons organized
  by their class number.
*/
module.exports = Backbone.Model.extend({
  defaults: {
    ArrangeClassNos: null,
    LessonType: null,
    ModuleCode: null
  },

  initialize: function () {

  }

});
