'use strict';


var App = require('../../app')
var _ = require('underscore');
var Grouping = require("./grouping")

var ArrangeLessonType = require("../models/ArrangeLessonTypeModel")
var ArrangeClassNo = require("../models/ArrangeClassNoModel")
var ArrangeModule = require("../models/ArrangeModuleModel")
var ArrangeModules = require("../models/ArrangeModulesModel")

var ArrangeModuleCollection = require("../collections/ArrangeModuleCollection")
var ArrangeLessonTypeCollection = require("../collections/ArrangeLessonTypeCollection")
var ArrangeClassNoCollection = require("../collections/ArrangeClassNoCollection")

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

    var arrange_modules = new ArrangeModules({
      ArrangeModules: new ArrangeModuleCollection()
    });

    // Loop through all the modules and group them
    modules.forEach(function(module) {
      /*
      console.log("Current Module");
      console.log(module);
      console.log("Module Timetable");
      console.log(module.get('Timetable'));
      */

      // Get some basic attributes of the module
      var moduleCode = module.get('ModuleCode');

      /* GROUPING SECTION - GROUP TIMETABLE by lesson type and class number */


      // Group all modules by their lesson type
      var module_timetable = module.get('Timetable');

      // convert to array after grouping to keep as array opposed to dictionary
      var grouped_by_lessons = _.toArray(_.groupBy(module_timetable, 'LessonType'));

      // After this conversion - every module is into subarrays where each subarrays contains
      // lessons of a particular lesson type.
      // Each subarray (one lesson type) is separated into subarrays where each subarray
      // contains lessons of a particular class number
      var grouped_by_classno = grouped_by_lessons.map(function(classes_by_lesson) {
        return _.toArray(_.groupBy(classes_by_lesson, 'ClassNo'));
      });

      /* END GROUPING SECTION - grouped_by_class_no holds the grouped modules */


      /*
        Model-ifying section - puts the modules and slots to be selected and arranged
        into the correct models and collections
      */

      // set the current module object
      // It should contain the module code and a list of ArrangeLessonType
      // objects that hold the lesson types for this module and their
      // associated lessons
      var current_arrange_module = new ArrangeModule({
        ModuleCode: moduleCode,
        ArrangeLessonTypes: new ArrangeLessonTypeCollection()
      });


      // Create a set of arrange models
      // loop through all lesson types for this module
      grouped_by_classno.forEach(function(all_by_lesson_type) {
        var lesson_type = all_by_lesson_type[0][0]["LessonType"];

        // For this lessontype - create an arrange_lessontype model
        // fill up the class numbers from later
        var current_arrange_lessontype = new ArrangeLessonType({
          ModuleCode: moduleCode,
          LessonType: lesson_type,
          ArrangeClassNos: new ArrangeClassNoCollection()
        });


        // loop through all class numbers for this module
        all_by_lesson_type.forEach(function(all_by_class_number) {

          // Creates the most informative inner class - the smallest unit of
          // arrangement - the lessons under a particular module, lesson number
          // and class number - this group has to be arranged all together.
          var current_arrange_classno_module = new ArrangeClassNo({
            ModuleCode: moduleCode,
            ClassNo: all_by_class_number[0]["ClassNo"],
            LessonType: all_by_class_number[0]["LessonType"],
            Lessons: all_by_class_number
          });

          // add these to the collection for the overall lesson type
          current_arrange_lessontype.get('ArrangeClassNos').add(current_arrange_classno_module);

        });

        // add each lesson type and its associated info to the overall module slots
        current_arrange_module.get('ArrangeLessonTypes').add(current_arrange_lessontype);


      });
      // add the module and its associated lessons to the overall collection module
      arrange_modules.get("ArrangeModules").add(current_arrange_module);
    });

    console.log("All arrange modules");
    console.log(arrange_modules);

    console.log(arrange_modules.permutations());

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
