'use strict';

module.exports = {

  // Utility function to group an array into array of arrays
  // via a grouping function
  groupBy: function(array, f){
    var groups = {};

    array.forEach( function(o) {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });

    return Object.keys(groups).map(function(group){
      return groups[group];
    });
  },

  groupByClassNo: function(timetable) {
    //console.log(computationListModule);
    return this.groupBy(timetable, function(item) { return item.ClassNo; });
  },

  groupByLessonType: function(computationListModule) {
    //console.log(computationListModule);
    return this.groupBy(computationListModule, function(item) { return item.LessonType; });
  }


};
