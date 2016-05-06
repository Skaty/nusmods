'use strict';

var Backbone = require('backbone');

/*
  This class contains a collection of ArrangeModules
  - has methods to operate on them
*/

module.exports = Backbone.Model.extend({

  initialize: function () {
    ArrangeModules: null;
  },

  /*
    Main entry point for calling permutations: calculates
    the number of permutations for all of the lessons under this
    set of modules
  */
  permutations: function() {
    if (this.get('ArrangeModules') == null) {
      return 0;
    } else {
      return this.get('ArrangeModules').reduce(function(memo, module) {
        return memo * module.permutations();
      }, 1);
    }
  },

  /*
    Recursively removes redundant lessons for each module.
    Mutates the internal lists to do this
  */
  removeRedundantLessons: function() {
    if (this.get('ArrangeModules') == null) {
      return 0;
    } else {
      return this.get('ArrangeModules').each(function(module) {
        module.removeRedundantLessons();
      });
    }
  }

});
