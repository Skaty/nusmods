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
  groupByLessonTypeAndClassNo: function(modules) {

  },
  doArrangement: function() {
    // This returns an object that with .exams returns an ExamCollection
    // and with .timetable returns a LessonCollection
    var selectedModules = App.request('selectedModules', this.semester);

    // Access the modules attribute to get a list of all selected MODULES
    // that have all the relevant information required.
    // Previously these didn't have all the timetable info, just what was selected
    var modules = selectedModules.models;

    console.log("Modules")
    console.log(modules);

    console.log("");
    console.log("Starting module loop");
    console.log("");

    // Loop through all the modules and group them
    modules.forEach(function(module) {
      console.log("Current Module");
      console.log(module);
      console.log("Module Timetable");
      console.log(module.get('Timetable'));

      console.log("");
      console.log("---module sep start---");

      // Group all modules by their lesson type
      var module_timetable = module.get('Timetable');

      // convert to array after grouping to keep as array opposed to dictionary
      module.set('Timetable', _.toArray(_.groupBy(module_timetable, 'LessonType')));

      // Get the list of modules - but grouped by lessons
      // [lessontype1, lessontype2..]..
      //      -> take lessontype1
      //              -> [classno1, classno2]
      //                    --> take classno1
      //                            --> [class1, class2]
      //          where class1 and class2 are both reqd for this ClassNo

      var grouped_by_lessons = module.get('Timetable');


      // After this conversion - every module is into subarrays where each subarrays contains
      // lessons of a particular lesson type.
      // Each subarray (one lesson type) is separated into subarrays where each subarray
      // contains lessons of a particular class number
      var grouped_by_classno = grouped_by_lessons.map(function(classes_by_lesson) {
        return _.toArray(_.groupBy(classes_by_lesson, 'ClassNo'));
      });




      // Update the lesson-grouped timetable
      module.set('Timetable', grouped_by_classno);

      console.log("Final module");
      console.log(module.get('Timetable'));
      console.log("----module sep----");
      console.log("");

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
