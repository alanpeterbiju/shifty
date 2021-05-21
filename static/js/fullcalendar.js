calendarMain();


function calendarMain() {
    var today;
    var shiftArray = []
    let calendar;


    

    document.addEventListener('DOMContentLoaded', function () {
        currentDate();
        initCalendar();
        

        addNewShift({
            title: "HelloASD",
            start: "2021-05-17"
        })


        document.getElementById("add-btn").onclick = function() {openNav()};
        document.getElementById("close-btn").onclick = function() {closeNav()};

     
        document.getElementById("startDate").flatpickr({
            altInput: true,
            altFormat: "D, d-m-Y",
            dateFormat: "Y-m-d"
            // dateFormat: "D, d/m/Y",
        });

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


       document.getElementById("addNewRoster").onsubmit = function() {addNewRoster()};

        
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
            // customButtons: {
            //     addEventButton: {
            //         text: 'Add new Shift',
            //         click: function () {
            //             var dateStr = prompt('Enter a date in YYYY-MM-DD format');
            //             var date = new Date(dateStr + 'T00:00:00'); // will be in local time
            //             var titles = prompt('Enter your staff name');


            //             if (!isNaN(date.valueOf())) { // valid?
            //                 calendar.addEvent({
            //                     title: titles,
            //                     start: date,
            //                     allDay: false
            //                 });
            //                 alert('You have successfully added a new shift');
            //             } else {
            //                 alert('Invalid date.');
            //             }
            //         }
            //     }
            // },
            events: []
        });
        calendar.render();
    };


    function addNewShift(event) {
        calendar.addEvent ( event );
        calendar.render();
    };



    function addShift() {
        var dateStr = prompt('Enter a date in YYYY-MM-DD format');
        var date = new Date(dateStr + 'T00:00:00'); // will be in local time
        var titles = prompt('Enter your staff name');
    
        addNewShift({
            title: titles,
            start: date,
            allDay: false
        })
        
    }


    /* Set the width of the side navigation to 250px */
    function openNav() {
        document.getElementById("mySidenav").style.width = "20vw";
    }

    /* Set the width of the side navigation to 0 */
    function closeNav() {
        resetNav();
        document.getElementById("mySidenav").style.width = "0";
    }


    function addNewRoster() {
        var selectedStaff =  $("#staffInput option:selected");
        var title = selectedStaff.text();
        var startDate = document.getElementById('startDate').value;
        var startTime =  document.getElementById('startTime').value;
        var endTime = document.getElementById('endTime').value;
        
        var startShift = startDate + "T" + startTime;
        var endShift = startDate + "T" + endTime;

        if ((selectedStaff.val() == 0) || (startDate == 0) || (startTime == 0) || (endTime == 0)) {
            $('#error').fadeIn(200);
            setTimeout(function() { 
                $('#error').fadeOut(1000); 
            }, 3000);
           
            
        } else {
            
            addNewShift({
                title: title,
                start: startShift,
                end: endShift,
                allDay: false
            })


            // alert("You have successfully added a new shift for " + title);
            $('#success').fadeIn(200);
            setTimeout(function() { 
                $('#success').fadeOut(1000); 
            }, 3000);
            closeNav();
        }
        
    }



    // Form reset after clicking Cancel button
    function resetNav() {
        document.getElementById("staffInput").selectedIndex = 0;
        document.getElementById('startDate').value = "";
        document.getElementById('startTime').value = "";
        document.getElementById('endTime').value = "";
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
