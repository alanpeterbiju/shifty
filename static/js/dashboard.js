calendarMain();


function calendarMain() {
    var today;
    let calendar;




    document.addEventListener('DOMContentLoaded', function () {
        currentDate();
        initCalendar();


        populateShifts({
            id: "1",
            title: "Data from databse should be here",
            start: "2021-05-17T14:20",
            end: "2021-05-17T15:30"
        })


        document.getElementById("add-btn").onclick = function () { openNav() };
        document.getElementById("close-btn").onclick = function () { closeNav() };
        // document.getElementById("closeShiftbtn").onclick = function () { closeShiftNav() };



        // FORM ELEMENTS 
        // DATE PICKER
        document.getElementById("startDate").flatpickr({
            altInput: true,
            altFormat: "D, d-m-Y",
            dateFormat: "Y-m-d"
        });

        // TIME PICKER
        document.getElementById("startTime").flatpickr({
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
        });

        document.getElementById("endTime").flatpickr({
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
        });

        //Submit button
        //event.preventDefault to stop page from loading
        $("#submit-button").on('click', function(event) {
            event.preventDefault();
            addNewRoster();
        });
    });



    function initCalendar() {
        var calendarEl = document.getElementById('calendar');
        calendar = new FullCalendar.Calendar(calendarEl, {
            height: 800,
            initialView: 'dayGridMonth',
            initialDate: today,
            selectable: true,
            selectHelper: true,
            editable: true,
            droppable: true,
            headerToolbar: {
                left: 'prev,next,today',
                //center: 'today',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            events: [],

            //Click on each event to see its details
            eventClick: function (info) {
                var eventObj = info.event;
                openShiftNav();
                $("#editStaffInput").val(eventObj.title);
                var startDateTime = eventObj.start;
                var day = startDateTime.toString().split(" ")[0];
                var date = startDateTime.getDate();
                var month = startDateTime.getMonth();
                var year = startDateTime.getFullYear();

                var hours = startDateTime.getHours();
                var minutes = startDateTime.getMinutes();

                switch (minutes) {
                    case 0:
                        minutes = "00";
                        break;
                    case 5:
                        minutes = "05";
                        break;
                }
                $("#editStartDate").val(day + ", " + date + "-" + month + "-" + year);
                $("#editStartTime").val(hours + ":" + minutes);

                var endDateTime = eventObj.end;
                var endHours = endDateTime.getHours();
                var endMinutes = endDateTime.getMinutes();

                switch (endMinutes) {
                    case 0:
                        endMinutes = "00";
                        break;
                    case 5:
                        endMinutes = "05";
                        break;
                }
                $("#editEndTime").val(endHours + ":" + endMinutes);
                $("#editNotes").val(eventObj.extendedProps.note);

                document.getElementById("removeShift").onsubmit = function (event) {
                    event.preventDefault();
                    $('#success-remove').fadeIn(200);
                    setTimeout(function () {
                        $('#success-remove').fadeOut(1000);
                    }, 3000);
                    removeShift(eventObj.id);
                };
            }
        });
        calendar.render();
    }






    //Populate shifts in the calender and render 
    function populateShifts(event) {
        calendar.addEvent(event);
        calendar.render();
    };


    /* Set the width of the side navigation to 250px */
    function openNav() {
        document.getElementById("mySidenav").style.width = "20vw";
        closeShiftNav();
    }

    function openShiftNav() {
        document.getElementById("shiftSideNav").style.width = "20vw";
        closeNav();
    }

    /* Set the width of the side navigation to 0 */
    function closeNav() {
        resetNav();
        document.getElementById("mySidenav").style.width = "0";
    }

    function closeShiftNav() {
        document.getElementById("shiftSideNav").style.width = "0";
    }



    //ADD NEW ROSTER
    function addNewRoster() {
        var selectedStaff = $("#staffInput option:selected");
        var title = selectedStaff.text();
        var startDate = document.getElementById('startDate').value;
        var startTime = document.getElementById('startTime').value;
        var endTime = document.getElementById('endTime').value;
        var note = document.getElementById('notes').value;

        var startShift = startDate + "T" + startTime;
        var endShift = startDate + "T" + endTime;

        //Validation fields must be filled
        if ((selectedStaff.val() == 0) || (startDate == 0) || (startTime == 0) || (endTime == 0)) {
            $('#error').fadeIn(200);
            setTimeout(function () {
                $('#error').fadeOut(1000);
            }, 3000);
        // Validation: Start end time can't be the same
        } else if (startTime == endTime) {
            $('#timeError').fadeIn(200);
            setTimeout(function () {
                $('#timeError').fadeOut(1000);
            }, 3000);
        } else {
            populateShifts({
                id: Math.floor((Math.random() * 100) + 1),
                title: title,
                start: startShift,
                end: endShift,
                extendedProps: {
                    note: note
                },
                allDay: false
            })
            $('#success').fadeIn(200);
            setTimeout(function () {
                $('#success').fadeOut(1000);
            }, 3000);
            resetNav();
            closeNav();
        }
    }



    function removeShift(eventId) {
        var removeEvent = calendar.getEventById(eventId);
        removeEvent.remove();
        resetNav();
        closeShiftNav();
    }


    // Form reset after clicking Cancel button
    function resetNav() {
        document.getElementById("staffInput").selectedIndex = 0;
        document.getElementById('startDate').value = "";
        document.getElementById('startTime').value = "";
        document.getElementById('endTime').value = "";
        document.getElementById('notes').value = "";
        $('#startDate').flatpickr().clear();
    }


    //Change calendar view depends on the today dates
    function currentDate() {
        today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;
        return today;
    }
}
