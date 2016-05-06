'use strict';


var App = require('../../app');
var _ = require('underscore');
var Grouping = require('./grouping');

var ArrangeLessonType = require('../models/ArrangeLessonTypeModel');
var ArrangeClassNo = require('../models/ArrangeClassNoModel');
var ArrangeModule = require('../models/ArrangeModuleModel');
var ArrangeModules = require('../models/ArrangeModulesModel');

var ArrangeModuleCollection = require('../collections/ArrangeModuleCollection');
var ArrangeLessonTypeCollection = require('../collections/ArrangeLessonTypeCollection');
var ArrangeClassNoCollection = require('../collections/ArrangeClassNoCollection');

module.exports = {
  /*
    initialize accepts 4 arguments:
      - options: general nusmods options (we mainly care about the current semester)
      - tightness: arrange-specific - specifies the packing distance between modules
      - no_before and no_after: a 24hr (2000 for eg) value indicating a preference
                                for where to constrain lessons to
  */
  initialize: function(options, tightness, noBefore, noAfter) {
    this.semester = options.semester;
    this.tightness = tightness;
    this.noBefore = noBefore;
    this.noAfter = noAfter;
  },

  // Groups a module by lessontype and then by class number
  groupModule: function(moduleTimetable) {
    // convert to array after grouping to keep as array opposed to dictionary
    var groupedByLessons = _.toArray(_.groupBy(moduleTimetable, 'LessonType'));

    // After this conversion - every module is into subarrays where each subarrays contains
    // lessons of a particular lesson type.
    // Each subarray (one lesson type) is separated into subarrays where each subarray
    // contains lessons of a particular class number
    var groupedByClassno = groupedByLessons.map(function(classesByLesson) {
      return _.toArray(_.groupBy(classesByLesson, 'ClassNo'));
    });

    return groupedByClassno;
  },

  doArrangement: function() {
    // This returns an object that with .exams returns an ExamCollection
    // and with .timetable returns a LessonCollection
    var selectedModules = App.request('selectedModules', this.semester);

    // Access the modules attribute to get a list of all selected MODULES
    // that have all the relevant information required.
    // Previously these didn't have all the timetable info, just what was selected
    var modules = selectedModules.models;

    console.log('Modules');
    console.log(modules);

    // Overall container for all the arrange-modules we create
    var arrangeModules = new ArrangeModules({
      ArrangeModules: new ArrangeModuleCollection()
    });

    // Keeps external context
    var arrangeThis = this;

    // Loop through all the modules
    modules.forEach(function(module) {

      // Get some basic attributes of the module
      var moduleCode = module.get('ModuleCode');
      var moduleTimetable = module.get('Timetable');

      // Group all modules by their lesson type
      // calls function "groupModule"
      // called through external context arrangeThis because we are
      // in a forEach
      var groupedByClassno = arrangeThis.groupModule(moduleTimetable);

      /*
        Model-ifying section - puts the modules and slots to be selected and arranged
        into the correct models and collections
      */

      // set the current module object
      // It should contain the module code and a list of ArrangeLessonType
      // objects that hold the lesson types for this module and their
      // associated lessons
      var currentArrangeModule = new ArrangeModule({
        ModuleCode: moduleCode,
        ArrangeLessonTypes: new ArrangeLessonTypeCollection()
      });


      // Create a set of arrange models
      // loop through all lesson types for this module
      groupedByClassno.forEach(function(allByLessonType) {
        var lessonType = allByLessonType[0][0].LessonType;

        // For this lessontype - create an arrange_lessontype model
        // fill up the class numbers from later
        var currentArrangeLessontype = new ArrangeLessonType({
          ModuleCode: moduleCode,
          LessonType: lessonType,
          ArrangeClassNos: new ArrangeClassNoCollection()
        });


        // loop through all class numbers for this module
        allByLessonType.forEach(function(allByClassNumber) {

          // Creates the most informative inner class - the smallest unit of
          // arrangement - the lessons under a particular module, lesson number
          // and class number - this group has to be arranged all together.
          var currentArrangeClassnoModule = new ArrangeClassNo({
            ModuleCode: moduleCode,
            ClassNo: allByClassNumber[0].ClassNo,
            LessonType: allByClassNumber[0].LessonType,
            Lessons: allByClassNumber
          });

          // add these to the collection for the overall lesson type
          currentArrangeLessontype.get('ArrangeClassNos').add(currentArrangeClassnoModule);

        });

        // add each lesson type and its associated info to the overall module slots
        currentArrangeModule.get('ArrangeLessonTypes').add(currentArrangeLessontype);


      });
      // add the module and its associated lessons to the overall collection module
      arrangeModules.get('ArrangeModules').add(currentArrangeModule);
    });

    console.log('All arrange modules');
    console.log(arrangeModules);

    console.log('Original Number of Permutations: ' + arrangeModules.permutations());

    // Need to cut down the slots that are repeated
    arrangeModules.removeRedundantLessons();

    console.log('Latest Number of Permutations: ' + arrangeModules.permutations());

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


};
