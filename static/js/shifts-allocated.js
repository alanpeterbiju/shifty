calendarMain();


function calendarMain() {
    var today;
    let calendar;




    document.addEventListener('DOMContentLoaded', function () {
        currentDate();
       


        document.getElementById("add-btn").onclick = function () { openNav() };
        document.getElementById("reassign-btn").onclick = function () { openNav() };
        document.getElementById("close-btn").onclick = function () { closeNav() };
        



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


        $("#submit-btn").on('click', function(event) {
            event.preventDefault();
            addNewRoster();
        });
    });



    /* Set the width of the side navigation to 250px */
    function openNav() {
        document.getElementById("mySidenav").style.width = "20vw";  
    }



    /* Set the width of the side navigation to 0 */
    function closeNav() {
        resetNav();
        document.getElementById("mySidenav").style.width = "0";
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
