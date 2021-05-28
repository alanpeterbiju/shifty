document.addEventListener('DOMContentLoaded', function () {

    addRowHandlers();


    document.getElementById("add-btn").onclick = function () { openNav() };
    document.getElementById("close-btn").onclick = function () { closeNav() };


    //Submit button when add new manager
    // document.getElementById("submit-btn").onclick = function (e) { 
    //     e.preventDefault();       
    //     addNewManager(e);   
    // };
    // document.getElementById("addNewManager").addEventListener("submit", function (e){
    //     let form = e.target;
    //     e.preventDefault();
    //     addNewManager(e);
    //     form.submit();
    // })

    document.getElementById("addNewManager").onsubmit = function() {
        addNewManager();
        // e.preventDefault();
    }
    
    //Submit button when edit manager
    // document.getElementById("edit-btn").onclick = function (e) { 
    //     e.preventDefault();       
    //     editManager(e); 
    // };


    // //Remove manager
    // document.getElementById("remove-btn").onclick = function (e) { 
    //     e.preventDefault();       
    //     removeManager(e); 
    // };
    

     // FORM ELEMENTS 
        // DATE PICKER
        document.getElementById("managerDateStarted").flatpickr({
            altInput: true,
            altFormat: "D, d-m-Y",
            dateFormat: "Y-m-d"
        });

        // document.getElementById("managerDateEnded").flatpickr({
        //     altInput: true,
        //     altFormat: "D, d-m-Y",
        //     dateFormat: "Y-m-d"
        // });

        document.getElementById("managerDOB").flatpickr({
            altInput: true,
            altFormat: "D, d-m-Y",
            dateFormat: "Y-m-d"
        });

    
    
        // Collapsable buttons for Add new Manager
    document.getElementById("collapsePositionBtn").onclick = function () {
        $("#collapsePositionBtn").addClass("btn-primary");
        //Change button color
        $("#collapseGeneralBtn").removeClass("btn-primary");
        $("#collapsePaymentBtn").removeClass("btn-primary");
        $("#collapseNotesBtn").removeClass(" btn-primary");
        //Collapse unused buttons
        $("#collapseGeneral").removeClass("show");
        $("#collapsePayment").removeClass("show");
        $("#collapseNotes").removeClass("show");
    };

    document.getElementById("collapseGeneralBtn").onclick = function () {
        $("#collapseGeneralBtn").addClass("btn-primary");
        //Change button color
        $("#collapsePositionBtn").removeClass("btn-primary");
        $("#collapsePaymentBtn").removeClass("btn-primary");
        $("#collapseNotesBtn").removeClass(" btn-primary");
        //Collapse unused buttons
        $("#collapsePosition").removeClass("show");
        $("#collapsePayment").removeClass("show");
        $("#collapseNotes").removeClass("show");
    };


    document.getElementById("collapsePaymentBtn").onclick = function () {
        $("#collapsePaymentBtn").addClass(" btn-primary");
        //Change button color
        $("#collapseGeneralBtn").removeClass("btn-primary");
        $("#collapsePositionBtn").removeClass("btn-primary");
        $("#collapseNotesBtn").removeClass("btn-primary");
        //Collapse unused buttons
        $("#collapseGeneral").removeClass("show");
        $("#collapsePosition").removeClass("show");
        $("#collapseNotes").removeClass("show");
    };


    document.getElementById("collapseNotesBtn").onclick = function () {
        $("#collapseNotesBtn").addClass("btn-primary");
        //Change button color
        $("#collapseGeneralBtn").removeClass("btn-primary");
        $("#collapsePositionBtn").removeClass("btn-primary");
        $("#collapsePaymentBtn").removeClass("btn-primary");
        //Collapse unused buttons
        $("#collapseGeneral").removeClass("show");
        $("#collapsePosition").removeClass("show");
        $("#collapsePayment").removeClass("show");
    };




    // Collapsable buttons for Manager Details
    document.getElementById("editCollapsePositionBtn").onclick = function () {
        $("#editCollapsePositionBtn").addClass("btn-primary");
        //Change button color
        $("#editCollapseGeneralBtn").removeClass("btn-primary");
        $("#editCollapsePaymentBtn").removeClass("btn-primary");
        $("#editCollapseNotesBtn").removeClass(" btn-primary");
        //Collapse unused buttons
        $("#editCollapseGeneral").removeClass("show");
        $("#editCollapsePayment").removeClass("show");
        $("#editCollapseNotes").removeClass("show");
    };

    document.getElementById("editCollapseGeneralBtn").onclick = function () {
        $("#editCollapseGeneralBtn").addClass("btn-primary");
        //Change button color
        $("#editCollapsePositionBtn").removeClass("btn-primary");
        $("#editCollapsePaymentBtn").removeClass("btn-primary");
        $("#editCollapseNotesBtn").removeClass(" btn-primary");
        //Collapse unused buttons
        $("#editCollapsePosition").removeClass("show");
        $("#editCollapsePayment").removeClass("show");
        $("#editCollapseNotes").removeClass("show");
    };

    document.getElementById("editCollapsePaymentBtn").onclick = function () {
        $("#editCollapsePaymentBtn").addClass(" btn-primary");
        //Change button color
        $("#editCollapseGeneralBtn").removeClass("btn-primary");
        $("#editCollapsePositionBtn").removeClass("btn-primary");
        $("#editCollapseNotesBtn").removeClass("btn-primary");
        //Collapse unused buttons
        $("#editCollapseGeneral").removeClass("show");
        $("#editCollapsePosition").removeClass("show");
        $("#editCollapseNotes").removeClass("show");
    };


    document.getElementById("editCollapseNotesBtn").onclick = function () {
        $("#editCollapseNotesBtn").addClass("btn-primary");
        //Change button color
        $("#editCollapseGeneralBtn").removeClass("btn-primary");
        $("#editCollapsePositionBtn").removeClass("btn-primary");
        $("#editCollapsePaymentBtn").removeClass("btn-primary");
        //Collapse unused buttons
        $("#editCollapseGeneral").removeClass("show");
        $("#editCollapsePosition").removeClass("show");
        $("#editCollapsePayment").removeClass("show");
    };

});



//Submit button to store manager new data

function addNewManager() {
    // e.preventDefault();
    var name = $("#managerName").val();
    var email = $("#managerEmail").val();
    var password = $("#managerPassword").val();
    var phone = $("#managerPhone").val();
    var dob = $("#managerDOB").val();

    var position = $("#managerPosition").val();
    var department = $("#managerDepartment").val();

    // var dateStarted = $("#managerDateStarted").val();
    var dateEnd = $("#managerDateEnded").val();

    var hourlyRate = $("#managerHourlyRate").val();
    var workingHours = $("#managerMaxHours").val();
    var holidayLeave = $("#managerHolidayLeave").val();
    var sickLeave = $("#managerSickLeave").val();

    var note = $("#managerNotes").val();

    if ((!name) || (!email) || (!password)) {
        $('#error').fadeIn(200);
        setTimeout(function () {
            $('#error').fadeOut(1000);
        }, 3000);
    } else {
        $('#success').fadeIn(200);
            setTimeout(function () {
                $('#success').fadeOut(1000);
            }, 3000);
        alert("Success");
    }
}



// Click on row to show manager details
function addRowHandlers() {
    var table = document.getElementById("data-table");
    var rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++) {
        var currentRow = table.rows[i];
        var createClickHandler =
       
            function(row) 
            {
                return function() { 
                                        var cell = row.getElementsByTagName("td")[0];
                                        var id = cell.innerHTML;
                                        alert("Manager ID is:" + id);
                                        openRemoveNav();
                                 };
            };
        currentRow.onclick = createClickHandler(currentRow);
    }
}


function editManager() {
    alert("Edit done");
}

function removeManager() {
    alert("removed!")
}


function openNav() {
    document.getElementById("mySidenav").style.width = "20vw";
    closeRemoveNav();
};

function openRemoveNav() {
    document.getElementById("editSidenav").style.width = "20vw";
    closeNav();
};

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}
function closeRemoveNav() {
    document.getElementById("editSidenav").style.width = "0";
}