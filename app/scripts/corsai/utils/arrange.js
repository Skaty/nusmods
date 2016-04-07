'use strict';


var App = require('../../app')
var _ = require('underscore');
var Grouping = require("./grouping")


module.exports = {
  /*
    initialize accepts 4 arguments:
      - options: general nusmods options (we mainly care about the current semester)
      - tightness: arrange-specific - specifies the packing distance between modules
      - no_before and no_after: a 24hr (2000 for eg) value indicating a preference
                                for where to constrain lessons to
  */
  initialize: function(options, tightness, no_before, no_after) {
    this.semester = options.semester;
    this.tightness = tightness;
    this.no_before = no_before;
    this.no_after = no_after
  },
  arrangement: function() {
    // This returns an object that with .exams returns an ExamCollection
    // and with .timetable returns a LessonCollection
    var selectedModules = App.request('selectedModules', this.semester);

    // Access the modules attribute to get a list of all selected MODULES
    // that have all the relevant information required.
    // Previously these didn't have all the timetable info, just what was selected
    var modules = selectedModules.models;
    modules.forEach(function(module) {
      console.log(module);
      console.log(module.get('Timetable'));

      // Group all modules by their lesson type
      var module_timetable = module.get('Timetable');
      module.set('Timetable', _.groupBy(module_timetable, 'LessonType'));
      console.log(module);

      // Group all lesson-type groups by their class number
      var updated_module_timetable = module.get('Timetable');
      for (var lesson_type in updated_module_timetable) {
        var lessons_by_type = updated_module_timetable[lesson_type];
        module.get('Timetable')[lesson_type] = _.groupBy(lessons_by_type, 'ClassNo');
      }

      // At this point, each module contains a Timetable field that
      // a key value pair where the key=Lesson Type (e.g. "Sectional Teaching")
      // and the value=Object
      // Value=Object - that object is indexed by the lesson number (e.g. 1) and
      // the value is an array of objects where each object is a lesson slot,
      // and each of those lessons are required to be taken for that ClassNo

      console.log(module);



    });






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


    //console.log(timetable
    //              .groupBy(function(lesson) { return lesson.get('ModuleCode'); }));


    }


}
