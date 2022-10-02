
Date.prototype.getWeek = function () {
// Based on: http://techblog.procurio...year-in-javascript.html
var targetThursday = new Date(this.getFullYear(),this.getMonth(),this.getDate()); // Remove time components of date
targetThursday.setDate(targetThursday.getDate() - ((targetThursday.getDay() + 6) % 7) + 3); // Change date to Thursday same week
var firstThursday = new Date(targetThursday.getFullYear(), 0, 4); // Take January 4th as it is always in week 1 (see ISO 8601)
firstThursday.setDate(firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7) + 3); // Change date to Thursday same week
var weekDiff = (targetThursday - firstThursday) / (86400000*7); // Number of weeks between target Thursday and first Thursday
return Math.round(1 + weekDiff);
}