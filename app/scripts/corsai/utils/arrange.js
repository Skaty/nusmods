'use strict';


var App = require('../../app')


module.exports = {
  initialize: function(options) {
    this.semester = options.semester;
  },
  arrangement: function() {
    // This returns an object that with .exams returns an ExamCollection
    // and with .timetable returns a LessonCollection
    var selectedModules = App.request('selectedModules', this.semester);

    // this is a LessonCollection
    // can call .each on this
    var timetable = selectedModules.timetable;

/* Some attributes
  ClassNo: "7"
  DayText:"Tuesday"
  EndTime:"1800"
  LessonType:"Lecture"
  ModuleCode:"LAC1201"
  ModuleTitle:"Chinese 1"
  StartTime:"1600"
  Venue:"AS3-0306"
  WeekText:"Every Week"
  color:0
  dayAbbrev:"tue"
  dayIndex:1
  display:true
  duration:4
  isDraggable:true
*/

    timetable.each(function(lesson) {
      console.log(lesson);
    })

    // This unwraps all the collection items
    var lessons = timetable.models;

    //console.log(selectedModules);
  }
}
