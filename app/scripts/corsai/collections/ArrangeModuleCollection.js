'use strict';

var Backbone = require('backbone');
var ArrangeModule = require('../models/ArrangeModuleModel');

module.exports = Backbone.Collection.extend({
  model: ArrangeModule
});
