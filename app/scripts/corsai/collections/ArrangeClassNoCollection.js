'use strict';

var Backbone = require('backbone');
var ArrangeClassNo = require('../models/ArrangeClassNoModel');

module.exports = Backbone.Collection.extend({
  model: ArrangeClassNo
});
