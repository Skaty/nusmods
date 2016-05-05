'use strict';

var Backbone = require('backbone');
var ArrangeLessonType = require('../models/ArrangeLessonTypeModel');

module.exports = Backbone.Collection.extend({
  model: ArrangeLessonType
});
