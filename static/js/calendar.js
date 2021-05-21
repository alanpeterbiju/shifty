var Calendar = tui.Calendar;

var templates = {
  popupIsAllDay: function() {
    return 'All Day';
  },
  popupStateFree: function() {
    return 'Free';
  },
  popupStateBusy: function() {
    return 'Busy';
  },
  titlePlaceholder: function() {
    return 'Subject';
  },
  locationPlaceholder: function() {
    return 'Location';
  },
  startDatePlaceholder: function() {
    return 'Start date';
  },
  endDatePlaceholder: function() {
    return 'End date';
  },
  popupSave: function() {
    return 'Save';
  },
  popupUpdate: function() {
    return 'Update';
  },
  popupDetailDate: function(isAllDay, start, end) {
    var isSameDate = moment(start).isSame(end);
    var endFormat = (isSameDate ? '' : 'YYYY.MM.DD ') + 'hh:mm a';

    if (isAllDay) {
      return moment(start).format('YYYY.MM.DD') + (isSameDate ? '' : ' - ' + moment(end).format('YYYY.MM.DD'));
    }

    return (moment(start).format('YYYY.MM.DD hh:mm a') + ' - ' + moment(end).format(endFormat));
  },
  popupDetailLocation: function(schedule) {
    return 'Location : ' + schedule.location;
  },
  popupDetailUser: function(schedule) {
    return 'User : ' + (schedule.attendees || []).join(', ');
  },
  popupDetailState: function(schedule) {
    return 'State : ' + schedule.state || 'Busy';
  },
  popupDetailRepeat: function(schedule) {
    return 'Repeat : ' + schedule.recurrenceRule;
  },
  popupDetailBody: function(schedule) {
    return 'Body : ' + schedule.body;
  },
  popupEdit: function() {
    return 'Edit';
  },
  popupDelete: function() {
    return 'Delete';
  }
};





var calendar = new Calendar('#calendar', {

  // 'day', 'week', 'month'
  defaultView: 'week',

  // shows the milestone and task in weekly, daily view
  taskView: false,
  // shows the all day and time grid in weekly, daily view
  scheduleView: true,
  template: templates,
  useCreationPopup: true,
  useDetailPopup: true,
  // override default styles here
  template: {
    monthDayname: function(dayname) {
      return '<span class="calendar-week-dayname-name">' + dayname.label + '</span>';
    }},


});



calendar.createSchedules([
  {
      id: '1',
      calendarId: '1',
      title: 'my schedule',
      category: 'time',
      dueDateClass: '',
      start: '2021-05-15T12:30:00+09:00',
      end: '2021-05-15T22:30:00+09:00'
  },
  {
      id: '2',
      calendarId: '1',
      title: 'second schedule',
      category: 'time',
      dueDateClass: '',
      start: '2018-01-18T17:30:00+09:00',
      end: '2018-01-19T17:31:00+09:00',
      isReadOnly: true    // schedule is read-only
  }
]);




document.getElementById("cal-next").onclick = function() {calendar.next()};
document.getElementById("cal-today").onclick = function() {calendar.today()};
document.getElementById("cal-prev").onclick = function() {calendar.prev()};
