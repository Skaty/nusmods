'use strict';


var App = require('../../app')
var _ = require('underscore');


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

    //console.log(timetable);

    timetable.each(function(lesson) {
      console.log(lesson);
    })

    // Format of the timetable accepted by herbert's algorithm:

    // Array of objects: Each object is a module of a certain lesson type (sectional etc) :
    // ExamDate: ...
    // ModuleCode: ...
    // Timetable: <Array of objects>
              // Each object is basically a particular class number
              // ClassNo: ...
              // LessonType: "Sectional Teaching"
              // Venue: ...
              // WeekText: ...
              // Timings: <Array of objects>
                      // Each timing object is a module that must be taken for this classno
                      // DayText: "Tuesday" eg
                      // EndTime: "1700" eg
                      // StartTime: "1600" eg


    console.log(timetable
                  .groupBy(function(lesson) { return lesson.get('ModuleCode'); }));
    },


}
