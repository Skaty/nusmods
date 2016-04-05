'use strict';

var $ = require('jquery');
var Marionette = require('backbone.marionette');
var _ = require('underscore');
var template = require('../templates/corsai.hbs');

module.exports = Marionette.ItemView.extend({
  template: template,

  events: {
    'click button': 'onClick'
  },

  onClick: function (event) {
    event.preventDefault();
  },

  initialize: function(options) {
    this.options = options;
  }
});
