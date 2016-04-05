'use strict';

var $ = require('jquery');
var Marionette = require('backbone.marionette');
var _ = require('underscore');
var template = require('../templates/corsai.hbs');

module.exports = Marionette.ItemView.extend({
  template: template,
  modal: '#corsai-modal',

  events: {
    'click #corsai-gen': 'onClick'
  },

  onClick: function (event) {
    event.preventDefault();
    this.popup();
  },

  initialize: function(options) {
    this.options = options;
  },

  popup: function() {
    require('bootstrap/modal');
    $(this.modal).modal();
  }
});
