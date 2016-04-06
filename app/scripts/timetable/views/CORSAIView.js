'use strict';

var $ = require('jquery');
var Marionette = require('backbone.marionette');
var _ = require('underscore');
var template = require('../templates/corsai.hbs');
var arrange = require('../../corsai/utils/arrange')

module.exports = Marionette.ItemView.extend({
  template: template,
  modal: '#corsai-modal',

  events: {
    'click #corsai-gen': 'onClick',
    'click #corsai-save': 'doArrange'
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
  },

  doArrange: function() {
    // pass the current semesters etc to arrange
    arrange.initialize(this.options);
    // initialize the arrangement
    arrange.arrangement();
  }

});
