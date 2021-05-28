calendarMain();


function calendarMain() {
    var today;
    let calendar;
    var startDate;
    var startTime;
    var endTime;
    var note;



    document.addEventListener('DOMContentLoaded', function () {
        currentDate();
  

        document.getElementById("addAvailability").onsubmit = function (e) {
            addNewAvailability();
            e.preventDefault();
        }




        document.getElementById("add-btn").onclick = function () { openNav() };
        document.getElementById("close-btn").onclick = function () { closeNav() };


        document.getElementById("accept-btn").onclick = function (e) { 
            e.preventDefault();
            acceptRequest() 
        };

        document.getElementById("decline-btn").onclick = function (e) { 
            declineRequest();
            e.preventDefault();
        };

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
        function addNewAvailability() {
             startDate = document.getElementById('startDate').value;
             startTime = document.getElementById('startTime').value;
             endTime = document.getElementById('endTime').value;
             note = document.getElementById('notes').value;


            var startShift = startDate + "T" + startTime;
            var endShift = startDate + "T" + endTime;

            //Validation fields must be filled
            if ((startDate == 0) || (startTime == 0) || (endTime == 0)) {
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


        // Form reset after clicking Cancel button
        function resetNav() {
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

        function acceptRequest() {
            $("#exampleModal").modal("hide");
            $('#accept-request').fadeIn(200);
            setTimeout(function () {
                $('#accept-request').fadeOut(1000);
            }, 3000);
            // Remove message from database   

        }

        function declineRequest() {
            $("#exampleModal").modal("hide");
            $('#decline-request').fadeIn(200);
            setTimeout(function () {
                $('#decline-request').fadeOut(1000);
            }, 3000);
            // Remove message from database
        }
    })
}

