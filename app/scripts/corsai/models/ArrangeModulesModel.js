'use strict';

var Backbone = require('backbone');

/*
  This class contains a collection of ArrangeModules
  - has methods to operate on them
*/

module.exports = Backbone.Model.extend({

  initialize: function () {
    ArrangeModules: null
  },

  permutations: function() {
    if (this.get('ArrangeModules') == null) {
      console.log("undefined arrangemodules");
      return 0;
    } else {
      return this.get('ArrangeModules').reduce(function(memo, module) {
        console.log("Module perm: " + module.permutations());
        return memo * module.permutations();
      }, 1)
    }
  }

});
