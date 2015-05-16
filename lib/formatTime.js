
exports.formatAMPM = function (date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ampm;
  return strTime;
}

exports.getTimeMinute = function (stringTime) {
  console.log(stringTime);
  var res = stringTime.match(/[A-z]+$/)
  var ampm = res[0];
  if ((ampm !== "am") && (ampm !== "pm")) return;
  var res = stringTime.match(/([0-9]*):([0-9]*)/)
  var hour = parseInt(res[1]) %12;
  console.log(hour);
  var minute = parseInt(res[2]);
  console.log(minute);
  var offset =0;
  if (ampm === "pm") offset = 12*60;

  return hour*60+minute+offset;
}

exports.ceilingFifteen = function (date){
  var minutes = date.getMinutes();
  var roundedDate = date.getTime() - minutes* 60 *1000;
  var quater = (minutes/15) | 0;
  roundedDate +=  (quater+1) * 15 * 60 * 1000;
  return new Date(roundedDate);

}

