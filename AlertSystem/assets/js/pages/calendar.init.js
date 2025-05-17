/*
Template Name: Velzon - Admin & Dashboard Template
Author: Themesbrand
Website: https://Themesbrand.com/
Contact: Themesbrand@gmail.com
File: Calendar init js
*/


var start_date = document.getElementById("event-start-date");
//var timepicker1 = document.getElementById("timepicker1");
//var timepicker2 = document.getElementById("timepicker2");
var date_range = null;
var T_check = null;


document.addEventListener("DOMContentLoaded", function () {
    var addEvent = new bootstrap.Modal(document.getElementById('event-modal'), {
        keyboard: false
    });
    document.getElementById('event-modal');
    var modalTitle = document.getElementById('modal-title');
    var formEvent = document.getElementById('form-event');
    var selectedEvent = null;
    var forms = document.getElementsByClassName('needs-validation');

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    var Draggable = FullCalendar.Draggable;
    var externalEventContainerEl = document.getElementById('external-events');
    var defaultEvents = [{
        id: 1,
        title: "World Braille Day",
        start: "2022-01-04",
        className: "bg-soft-info",
        allDay: true
    },
    ];

    new Draggable(externalEventContainerEl, {
        itemSelector: '.external-event',
        eventData: function (eventEl) {
            return {
                id: Math.floor(Math.random() * 11000),
                title: eventEl.innerText,
                allDay: true,
                start: new Date(),
                className: eventEl.getAttribute('data-class')
            };
        }
    });

    var calendarEl = document.getElementById('calendar');



    function addNewEvent(info) {
        document.getElementById('form-event').reset();
        document.getElementById('btn-delete-event').setAttribute('hidden', true);
        addEvent.show();
        formEvent.classList.remove("was-validated");
        formEvent.reset();
        selectedEvent = null;
        modalTitle.innerText = 'Add Event';
        newEventData = info;
        document.getElementById("edit-event-btn").setAttribute("data-id", "new-event");
        document.getElementById('edit-event-btn').click();
        document.getElementById("edit-event-btn").setAttribute("hidden", true);
    }

    function getInitialView() {
        if (window.innerWidth >= 768 && window.innerWidth < 1200) {
            return 'timeGridWeek';
        } else if (window.innerWidth <= 768) {
            return 'listMonth';
        } else {
            return 'dayGridMonth';
        }
    }

    var eventCategoryChoice = new Choices("#event-category", {
        searchEnabled: false
    });

    var calendar = new FullCalendar.Calendar(calendarEl, {
        timeZone: 'local',
        editable: true,
        droppable: true,
        selectable: true,
        navLinks: true,
        initialView: getInitialView(),
        themeSystem: 'bootstrap',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
        },
        windowResize: function (view) {
            var newView = getInitialView();
            calendar.changeView(newView);
        },
        eventResize: function (info) {
            var indexOfSelectedEvent = defaultEvents.findIndex(function (x) {
                return x.id == info.event.id
            });
            if (defaultEvents[indexOfSelectedEvent]) {
                defaultEvents[indexOfSelectedEvent].title = info.event.title;
                defaultEvents[indexOfSelectedEvent].start = info.event.start;
                defaultEvents[indexOfSelectedEvent].end = (info.event.end) ? info.event.end : null;
                defaultEvents[indexOfSelectedEvent].allDay = info.event.allDay;
                defaultEvents[indexOfSelectedEvent].className = info.event.classNames[0];
                defaultEvents[indexOfSelectedEvent].description = (info.event._def.extendedProps.description) ? info.event._def.extendedProps.description : '';
                defaultEvents[indexOfSelectedEvent].location = (info.event._def.extendedProps.location) ? info.event._def.extendedProps.location : '';
            }
            /* upcomingEvent(defaultEvents);*/
        },
        eventClick: function (info) {
            document.getElementById("edit-event-btn").removeAttribute("hidden");
            document.getElementById('btn-save-event').setAttribute("hidden", true);
            document.getElementById("edit-event-btn").setAttribute("data-id", "edit-event");
            document.getElementById("edit-event-btn").innerHTML = "Edit";
            eventClicked();
            addEvent.show();
            formEvent.reset();
            selectedEvent = info.event;

            // First Modal
            document.getElementById("modal-title").innerHTML = "";
            document.getElementById("event-location-tag").innerHTML = selectedEvent.extendedProps.location === undefined ? "No Location" : selectedEvent.extendedProps.location;
            document.getElementById("event-description-tag").innerHTML = selectedEvent.extendedProps.description === undefined ? "No Description" : selectedEvent.extendedProps.description;

            // Edit Modal
            document.getElementById("event-job").value = selectedEvent.title;
            document.getElementById("event-part").value = selectedEvent.title;
            document.getElementById("event-location").value = selectedEvent.extendedProps.location === undefined ? "No Location" : selectedEvent.extendedProps.location;
            document.getElementById("event-description").value = selectedEvent.extendedProps.description === undefined ? "No Description" : selectedEvent.extendedProps.description;
            document.getElementById("eventid").value = selectedEvent.id;

            if (selectedEvent.classNames[0]) {
                eventCategoryChoice.destroy();
                eventCategoryChoice = new Choices("#event-category", {
                    searchEnabled: false
                });
                eventCategoryChoice.setChoiceByValue(selectedEvent.classNames[0]);
            }
            var st_date = selectedEvent.start;
            var ed_date = selectedEvent.end;

            var date_r = function formatDate(date) {
                var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();
                if (month.length < 2)
                    month = '0' + month;
                if (day.length < 2)
                    day = '0' + day;
                return [year, month, day].join('-');
            };
            var updateDay = null
            if (ed_date != null) {
                var endUpdateDay = new Date(ed_date);
                updateDay = endUpdateDay.setDate(endUpdateDay.getDate() - 1);
            }

            var r_date = ed_date == null ? formatDate(st_date) : formatDate(st_date) + ' to ' + formatDate(updateDay);
            var er_date = ed_date == null ? formatDate(st_date) : formatDate(st_date) + ' to ' + formatDate(updateDay);

            flatpickr(start_date, {
                defaultDate: er_date,
                altInput: true,
                altFormat: "j F Y",
                dateFormat: "Y-m-d",
                mode: ed_date !== null ? "range" : "range",
                onChange: function (selectedDates, dateStr, instance) {
                    var date_range = dateStr;
                    var dates = date_range.split("to");
                    if (dates.length > 1) {
                        document.getElementById('event-time').setAttribute("hidden", true);
                    } else {
                        //document.getElementById("timepicker1").parentNode.classList.remove("d-none");
                        //document.getElementById("timepicker1").classList.replace("d-none", "d-block");
                        //document.getElementById("timepicker2").parentNode.classList.remove("d-none");
                        //document.getElementById("timepicker2").classList.replace("d-none", "d-block");
                        document.getElementById('event-time').removeAttribute("hidden");
                    }
                },
            });
            document.getElementById("event-start-date-tag").innerHTML = r_date;

            var gt_time = getTime(selectedEvent.start);
            var ed_time = getTime(selectedEvent.end);

            if (gt_time == ed_time) {
                //document.getElementById('event-time').setAttribute("hidden", true);
                //flatpickr(document.getElementById("timepicker1"), {
                //    enableTime: true,
                //    noCalendar: true,
                //    dateFormat: "H:i",
                //});
                //flatpickr(document.getElementById("timepicker2"), {
                //    enableTime: true,
                //    noCalendar: true,
                //    dateFormat: "H:i",
                //});
            }
            else {
                //document.getElementById('event-time').removeAttribute("hidden");
                //flatpickr(document.getElementById("timepicker1"), {
                //    enableTime: true,
                //    noCalendar: true,
                //    dateFormat: "H:i",
                //    defaultDate: gt_time
                //});

                //flatpickr(document.getElementById("timepicker2"), {
                //    enableTime: true,
                //    noCalendar: true,
                //    dateFormat: "H:i",
                //    defaultDate: ed_time
                //});
                //document.getElementById("event-timepicker1-tag").innerHTML = tConvert(gt_time);
                //document.getElementById("event-timepicker2-tag").innerHTML = tConvert(ed_time);
            }
            newEventData = null;
            modalTitle.innerText = selectedEvent.title;

            // formEvent.classList.add("view-event");
            document.getElementById('btn-delete-event').removeAttribute('hidden');
        },
        dateClick: function (info) {
            addNewEvent(info);
        },
        events: defaultEvents,
        eventReceive: function (info) {
            var newid = parseInt(info.event.id);
            var newEvent = {
                id: newid,
                title: info.event.title,
                start: info.event.start,
                allDay: info.event.allDay,
                className: info.event.classNames[0]
            };
            defaultEvents.push(newEvent);
            /*   upcomingEvent(defaultEvents);*/
        },
        eventDrop: function (info) {
            var indexOfSelectedEvent = defaultEvents.findIndex(function (x) {
                return x.id == info.event.id
            });
            if (defaultEvents[indexOfSelectedEvent]) {
                defaultEvents[indexOfSelectedEvent].title = info.event.title;
                defaultEvents[indexOfSelectedEvent].start = info.event.start;
                defaultEvents[indexOfSelectedEvent].end = (info.event.end) ? info.event.end : null;
                defaultEvents[indexOfSelectedEvent].allDay = info.event.allDay;
                defaultEvents[indexOfSelectedEvent].className = info.event.classNames[0];
                defaultEvents[indexOfSelectedEvent].description = (info.event._def.extendedProps.description) ? info.event._def.extendedProps.description : '';
                defaultEvents[indexOfSelectedEvent].location = (info.event._def.extendedProps.location) ? info.event._def.extendedProps.location : '';
            }
        }
    });
    fetchEventsFromBackend();
    var searchInput = document.getElementById("event-search");
    searchInput.addEventListener("input", function () {
        var searchTerm = this.value;
        fetchEventsFromBackend(searchTerm);
    });

    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Tab") {
            event.preventDefault();
        }
    });
    upcomingEvent(defaultEvents);


    function fetchEventsFromBackend(searchTerm = "") {
        fetch('/Apps/GetFullevents')
            .then(response => response.json())
            .then(data => {
                var events = data.map(event => {
                    var startDate = event.start ? new Date(parseInt(event.start.replace('/Date(', ''))) : null;
                    var endDate = event.end ? new Date(parseInt(event.end.replace('/Date(', ''))) : null;

                    var title;
                    if (startDate.toDateString() === endDate.toDateString()) {
                        title = `${event.op} - ${event.title} - ${event.machine_name} - ${event.jobNum} - ${event.partNum}<br>`;
                    } else {
                        title = `${event.op} - ${event.title} - ${event.machine_name} - ${event.jobNum} - ${event.partNum}`;
                    }

                    var eventProps = {
                        id: event.id,
                        title: title,
                        start: startDate,
                        end: endDate,
                        backgroundColor: event.color,
                        borderColor: event.color,
                        extendedProps: {
                            jobNum: event.jobNum,
                            partNum: event.partNum,
                            op: event.op
                        },
                        html: true
                    };
                    return eventProps;
                });

                var filteredEvents = events.filter(event => {
                    var eventTitle = event.title ? event.title.toLowerCase() : '';
                    return eventTitle.includes(searchTerm.toLowerCase());
                });

                calendar.removeAllEvents();
                calendar.addEventSource(filteredEvents);
                upcomingEvent(filteredEvents, searchTerm);

            })
            .catch(error => {
                console.error('Error fetching events:', error);
            });
    }

    calendar.render();

    formEvent.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var updatedTitle = document.getElementById("event-job").value;
        var updatedpart = document.getElementById("event-part").value;
        var updatedCategory = document.getElementById('event-category').value;
        var start_date = (document.getElementById("event-start-date").value).split("to");
        var updateStartDate = new Date(start_date[0].trim());

        var newdate = new Date(start_date[1]);
        newdate.setDate(newdate.getDate() + 1);

        var updateEndDate = (start_date[1]) ? newdate : '';

        var end_date = null;
        var eventDescription = document.getElementById("event-description").value;
        var eventid = document.getElementById("eventid").value;
        var all_day = false;
        if (start_date.length > 1) {
            var end_date = new Date(start_date[1]);
            end_date.setDate(end_date.getDate() + 1);
            start_date = new Date(start_date[0]);
            all_day = true;
        } else {
            //var e_date = start_date;
            //var start_time = (document.getElementById("timepicker1").value).trim();
            //var end_time = (document.getElementById("timepicker2").value).trim();
            //start_date = new Date(start_date + "T" + start_time);
            //end_date = new Date(e_date + "T" + end_time);
        }
        var e_id = defaultEvents.length + 1;

        // validation
        if (forms[0].checkValidity() === false) {
            forms[0].classList.add('was-validated');
        } else {
            if (selectedEvent) {
                selectedEvent.setProp("id", eventid);
                selectedEvent.setProp("title", updatedTitle);
                selectedEvent.setProp("classNames", [updatedCategory]);
                selectedEvent.setStart(updateStartDate);
                selectedEvent.setEnd(updateEndDate);
                selectedEvent.setAllDay(all_day);
                selectedEvent.setExtendedProp("description", eventDescription);
                var indexOfSelectedEvent = defaultEvents.findIndex(function (x) {
                    return x.id == selectedEvent.id
                });
                if (defaultEvents[indexOfSelectedEvent]) {
                    defaultEvents[indexOfSelectedEvent].title = updatedTitle;
                    defaultEvents[indexOfSelectedEvent].start = updateStartDate;
                    defaultEvents[indexOfSelectedEvent].end = updateEndDate;
                    defaultEvents[indexOfSelectedEvent].allDay = all_day;
                    defaultEvents[indexOfSelectedEvent].className = updatedCategory;
                    defaultEvents[indexOfSelectedEvent].description = eventDescription;
                }
                calendar.render();
                // default
            } else {
                var newEvent = {
                    id: e_id,
                    title: updatedTitle,
                    start: start_date,
                    end: end_date,
                    allDay: all_day,
                    className: updatedCategory,
                    description: eventDescription
                };
                calendar.addEvent(newEvent);
                defaultEvents.push(newEvent);
            }
            addEvent.hide();
            /* upcomingEvent(defaultEvents);*/
        }
    });

    document.getElementById("btn-delete-event").addEventListener("click", function (e) {
        if (selectedEvent) {
            for (var i = 0; i < defaultEvents.length; i++) {
                if (defaultEvents[i].id == selectedEvent.id) {
                    defaultEvents.splice(i, 1);
                    i--;
                }
            }
            /*  upcomingEvent(defaultEvents);*/
            selectedEvent.remove();
            selectedEvent = null;
            addEvent.hide();
        }
    });
    document.getElementById("btn-new-event").addEventListener("click", function (e) {
        addNewEvent();
        document.getElementById("edit-event-btn").setAttribute("data-id", "new-event");
        document.getElementById('edit-event-btn').click();
        document.getElementById("edit-event-btn").setAttribute("hidden", true);
    });
});

/*Add new event */
function submitnewevent(machineName) {
    var jobnum = $("#event-job");
    var partnum = $("#event-part");
    var revision = $("#event-rev");
    var Op_No = $("#event-op");
    var startdate = $("#event-date");
    var enddate = $("#event-end-date");
    var machine = $("#event-category");
    var setuptime = $("#event-setuptime");
    var cycletime = $("#event-cycletime");
    var completedday = $("#event-end-days");
    var jobqty = $("#event-jobqty");
    var assignqty = $("#event-assignedqty");

    var _planning = {};
    _planning.JobNum = jobnum.val();
    _planning.PartNum = partnum.val();
    _planning.revision = revision.val();
    _planning.OP = Op_No.val();
    _planning.Planning_start_date = startdate.val();
    _planning.machine = machine.val();
    _planning.Machine_name = machineName;
    _planning.Planning_start_date = startdate.val();
    _planning.Planning_end_date = enddate.val();
    _planning.Setup_time = setuptime.val();
    _planning.Cycle_Time = cycletime.val();
    _planning.Completed_Day = completedday.val();
    _planning.Job_Qty = jobqty.val();
    _planning.Assigned_Qty = assignqty.val();

    $.ajax({
        type: "POST",
        url: "/Apps/Insertplanning",
        data: JSON.stringify(_planning),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            fetchEventsFromBackend();
            function fetchEventsFromBackend() {
                fetch('/Apps/GetFullevents')
                    .then(response => response.json())
                    .then(data => {
                        var events = data.map(event => {
                            var startDate = event.start ? new Date(parseInt(event.start.replace('/Date(', ''))) : null;
                            var endDate = event.end ? new Date(parseInt(event.end.replace('/Date(', ''))) : null;
                            var title;
                            if (startDate.toDateString() === endDate.toDateString()) {
                                title = `${event.op} - ${event.title} - ${event.machine_name} - ${event.jobNum} - ${event.partNum}<br>`;
                            } else {
                                title = `${event.op} - ${event.title} - ${event.machine_name} - ${event.jobNum} - ${event.partNum}`;
                            }
                            var eventProps = {
                                id: event.id,
                                title: title,
                                start: startDate,
                                end: endDate,
                                backgroundColor: event.color,
                                borderColor: event.color,
                                extendedProps: {
                                    jobNum: event.jobNum,
                                    partNum: event.partNum,
                                    op: event.op
                                },
                                html: true
                            };

                            return eventProps;
                        });

                        calendar.addEventSource(events);
                        upcomingEvent(events);
                    })
                    .catch(error => {
                        console.error('Error fetching events:', error);
                    });
            }
            $("#event-modal").modal("hide");
            jobnum.val('');
            partnum.val('');
            revision.val('');
            Op_No.val('');
            startdate.val('');
            enddate.val('');
            machine.val('');
            machinename.val('');
        },
        error: function (response) {
            console.log(response);
        }
    });
}
function submitForSelectedMachines() {
    var selectedMachines = $("#drpmachinename").val();

    if (!selectedMachines || selectedMachines.length === 0) {
        console.log("No machines selected.");
        return;
    }


    selectedMachines.forEach(function (machineName) {
        submitnewevent(machineName);
    });
}
/*Add new event */
$(document).ready(function () {
    $("#event-job").change(function () {
        var JobNum = document.getElementById("event-job").value;
        $.get("/Apps/Getpartnumber", { JobNum: JobNum }, function (data) {
            $("#Part_number").empty();
            $.each(data, function (index, row) {
                $("#event-part").val(row.PartNum);
                $("#event-rev").val(row.RevisionNum);
                $("#event-jobqty").val(row.ProdQty);
                $("#event-assignedqty").val(row.ProdQty);
                document.getElementById("event-rev").disabled = true;
                document.getElementById("event-part").disabled = true;
            });
        });
        $.get("/Apps/GetOpno", { JobNum: JobNum }, function (data) {
            $("#event-op").empty();
            $.each(data, function (index, row) {
                $("#event-op").append("<option value='" + row.OprSeq + "'>" + row.OprSeq + "-" + row.ResourceGrpID + "</option>")
                $('#event-op').val(row.OP);
            });
        });

        $("#event-op").change(function () {
            var OpNum = $(this).val();
            $.get("/Apps/GetSetupAndCycleTime", { JobNum: JobNum, OpNum: OpNum }, function (data) {
                $("#event-setuptime").empty();
                $("#event-cycletime").empty();
                $.each(data, function (index, row) {

                    var setuptime = row.EstSetHours;
                    var stime = 0;
                    stime = (setuptime) * 60;
                    var getstimesplit = stime.toString().split(".")[0];
                    $('#event-setuptime').empty().val(getstimesplit);

                    var cycltym = row.EstProdHours;
                    var finalcycletime = (cycltym * 60) / $("#event-jobqty").val();
                    var ct = finalcycletime.toFixed(2);
                    $("#event-cycletime").val(ct);

                    var totaltime = finalcycletime * $("#event-jobqty").val();
                    var totalworkinghours = 1160;
                    var days = totaltime / totalworkinghours;
                    var daylimit = days.toFixed(2);
                    $("#event-end-days").val(daylimit);
                });
            });
        });
        $("#event-date").change(function () {
            alert("Hello");
            var round = parseFloat($("#event-end-days").val());
            var roundofday = Math.round(round);
            var startdate = $("#event-date").val();
            var startDatenew = new Date(startdate);
            var endDatenew = new Date(startDatenew);
            if (roundofday == 0) {
                endDatenew.setDate(startDatenew.getDate() + roundofday);
            }
            else {
                endDatenew.setDate(startDatenew.getDate() + roundofday - 1);
            }

            var enddate = formatDate(endDatenew);
            $("#event-end-date").val(enddate);

            function formatDate(date) {
                var year = date.getFullYear();
                var month = (date.getMonth() + 1).toString().padStart(2, '0');
                var day = date.getDate().toString().padStart(2, '0');
                return year + '-' + month + '-' + day;
            }
        });
    });
});

$(document).ready(function () {
    $("#event-category").change(function () {
        let selectedCategory = $(this).val();
        console.log("Selected category:", selectedCategory);

        $.ajax({
            url: "/Apps/searchrecords",
            type: "GET",
            data: { machinetype: selectedCategory },
            dataType: "json",
            success: function (data) {
                console.log("AJAX success:", data);
                machinenamedropdown(data);
            },
            error: function (error) {
                console.log("AJAX error:", error);
            }
        });
    });
});

$(document).ready(function () {
    $("#drpmachineforselection").change(function () {
        let selectedCategory = $(this).val();
        console.log("Selected category:", selectedCategory);

        $.ajax({
            url: "/Apps/searchrecords",
            type: "GET",
            data: { machinetype: selectedCategory },
            dataType: "json",
            success: function (data) {
                console.log("AJAX success:", data);
                machinenamedropdownforall(data);
            },
            error: function (error) {
                console.log("AJAX error:", error);
            }
        });
    });
});

function checkSelectedValues() {
    var selectedValues = $("#drpmachinename").val();

    if (selectedValues.length === 0) {
        console.log("No values selected.");
    } else if (selectedValues.length === 1) {
        console.log("One value selected:", selectedValues[0]);
    } else {
        console.log(selectedValues.length + " values selected:", selectedValues);
    }
}


$(document).ready(function () {
    $("#drpmachinename").change(function () {
        var selectedMachines = $(this).val();

        if (!selectedMachines || selectedMachines.length === 0) {
            console.log("No machines selected.");
            return; // Exit the function if no machines are selected
        }
        var JobNum = document.getElementById("event-job").value;
        var OpNum = $("#event-op").val();
        $.get("/Apps/GetSetupAndCycleTime", { JobNum: JobNum, OpNum: OpNum }, function (data) {
            $("#event-setuptime").empty();
            $("#event-cycletime").empty();
            $("#event-end-days").empty();

            $.each(data, function (index, row) {
                var setuptime = row.EstSetHours;
                var stime = (setuptime) * 60;
                var getstimesplit = stime.toString().split(".")[0];
                $('#event-setuptime').val(getstimesplit);

                var cycltym = row.EstProdHours;
                var finalcycletime = (cycltym * 60) / $("#event-jobqty").val();
                var ct = finalcycletime.toFixed(2);
                $("#event-cycletime").val(ct);

                var totaltime = finalcycletime * $("#event-jobqty").val();
                var totalworkinghours = 1160;
                var days = totaltime / totalworkinghours;
                var daylimit = days.toFixed(2);
                var machinesPerDay = daylimit / selectedMachines.length;
                var jobqty = $("#event-jobqty").val();
                var assignedqty = jobqty / selectedMachines.length;
                $("#event-assignedqty").val(assignedqty);
                var machineday = machinesPerDay.toFixed(2);
                $("#event-end-days").val(machineday);
            });
        });
    });
});

$(document).ready(function () {
    var defaultEvents = [{
        id: 1,
        title: "World Braille Day",
        start: "2022-01-04",
        className: "bg-soft-info",
        allDay: true
    }];

    var calendarEl = document.getElementById('calendar');



    function addNewEvent(info) {
        document.getElementById('form-event').reset();
        document.getElementById('btn-delete-event').setAttribute('hidden', true);
        addEvent.show();
        formEvent.classList.remove("was-validated");
        formEvent.reset();
        selectedEvent = null;
        modalTitle.innerText = 'Add Event';
        newEventData = info;
        document.getElementById("edit-event-btn").setAttribute("data-id", "new-event");
        document.getElementById('edit-event-btn').click();
        document.getElementById("edit-event-btn").setAttribute("hidden", true);
    }

    function getInitialView() {
        if (window.innerWidth >= 768 && window.innerWidth < 1200) {
            return 'timeGridWeek';
        } else if (window.innerWidth <= 768) {
            return 'listMonth';
        } else {
            return 'dayGridMonth';
        }
    }

    var eventCategoryChoice = new Choices("#event-category", {
        searchEnabled: false
    });

    function fetchEventsFromBackend(searchTerm = "") {
        fetch('/Apps/GetFullevents')
            .then(response => response.json())
            .then(data => {
                var events = data.map(event => {
                    var startDate = event.start ? new Date(parseInt(event.start.replace('/Date(', ''))) : null;
                    var endDate = event.end ? new Date(parseInt(event.end.replace('/Date(', ''))) : null;
                    var title;
                    if (startDate.toDateString() === endDate.toDateString()) {
                        title = `${event.op} - ${event.title} - ${event.machine_name} - ${event.jobNum} - ${event.partNum}`;
                    } else {
                        title = `${event.op} - ${event.title} - ${event.machine_name} - ${event.jobNum} - ${event.partNum}`;
                    }

                    var content = title;
                    if (startDate.toDateString() !== endDate.toDateString()) {
                        content += '<br>';
                    }

                    var eventProps = {
                        id: event.id,
                        title: title,
                        start: startDate,
                        end: endDate,
                        backgroundColor: event.color,
                        borderColor: event.color,
                        extendedProps: {
                            jobNum: event.jobNum,
                            partNum: event.partNum,
                            op: event.op
                        },
                        html: true
                    };
                    return eventProps;
                });

                var filteredEvents = events.filter(event => {
                    var eventTitle = event.title ? event.title.toLowerCase() : '';
                    return eventTitle.includes(searchTerm.toLowerCase());
                });

                calendar.removeAllEvents();
                calendar.addEventSource(filteredEvents);
                upcomingEvent(filteredEvents, searchTerm);

            })
            .catch(error => {
                console.error('Error fetching events:', error);
            });
    }

    var calendar = new FullCalendar.Calendar(calendarEl, {
        timeZone: 'local',
        editable: true,
        droppable: true,
        selectable: true,
        navLinks: true,
        initialView: getInitialView(),
        themeSystem: 'bootstrap',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
        },
        windowResize: function (view) {
            var newView = getInitialView();
            calendar.changeView(newView);
        },
        eventResize: function (info) {
            var indexOfSelectedEvent = defaultEvents.findIndex(function (x) {
                return x.id == info.event.id
            });
            if (defaultEvents[indexOfSelectedEvent]) {
                defaultEvents[indexOfSelectedEvent].title = info.event.title;
                defaultEvents[indexOfSelectedEvent].start = info.event.start;
                defaultEvents[indexOfSelectedEvent].end = (info.event.end) ? info.event.end : null;
                defaultEvents[indexOfSelectedEvent].allDay = info.event.allDay;
                defaultEvents[indexOfSelectedEvent].className = info.event.classNames[0];
                defaultEvents[indexOfSelectedEvent].description = (info.event._def.extendedProps.description) ? info.event._def.extendedProps.description : '';
                defaultEvents[indexOfSelectedEvent].location = (info.event._def.extendedProps.location) ? info.event._def.extendedProps.location : '';
            }
            /* upcomingEvent(defaultEvents);*/
        },
        eventClick: function (info) {
            document.getElementById("edit-event-btn").removeAttribute("hidden");
            document.getElementById('btn-save-event').setAttribute("hidden", true);
            document.getElementById("edit-event-btn").setAttribute("data-id", "edit-event");
            document.getElementById("edit-event-btn").innerHTML = "Edit";
            eventClicked();
            addEvent.show();
            formEvent.reset();
            selectedEvent = info.event;

            // First Modal
            document.getElementById("modal-title").innerHTML = "";
            document.getElementById("event-location-tag").innerHTML = selectedEvent.extendedProps.location === undefined ? "No Location" : selectedEvent.extendedProps.location;
            document.getElementById("event-description-tag").innerHTML = selectedEvent.extendedProps.description === undefined ? "No Description" : selectedEvent.extendedProps.description;

            // Edit Modal
            document.getElementById("event-job").value = selectedEvent.title;
            document.getElementById("event-part").value = selectedEvent.title;
            document.getElementById("event-location").value = selectedEvent.extendedProps.location === undefined ? "No Location" : selectedEvent.extendedProps.location;
            document.getElementById("event-description").value = selectedEvent.extendedProps.description === undefined ? "No Description" : selectedEvent.extendedProps.description;
            document.getElementById("eventid").value = selectedEvent.id;

            if (selectedEvent.classNames[0]) {
                eventCategoryChoice.destroy();
                eventCategoryChoice = new Choices("#event-category", {
                    searchEnabled: false
                });
                eventCategoryChoice.setChoiceByValue(selectedEvent.classNames[0]);
            }
            var st_date = selectedEvent.start;
            var ed_date = selectedEvent.end;

            var date_r = function formatDate(date) {
                var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();
                if (month.length < 2)
                    month = '0' + month;
                if (day.length < 2)
                    day = '0' + day;
                return [year, month, day].join('-');
            };
            var updateDay = null
            if (ed_date != null) {
                var endUpdateDay = new Date(ed_date);
                updateDay = endUpdateDay.setDate(endUpdateDay.getDate() - 1);
            }

            var r_date = ed_date == null ? formatDate(st_date) : formatDate(st_date) + ' to ' + formatDate(updateDay);
            var er_date = ed_date == null ? formatDate(st_date) : formatDate(st_date) + ' to ' + formatDate(updateDay);

            flatpickr(start_date, {
                defaultDate: er_date,
                altInput: true,
                altFormat: "j F Y",
                dateFormat: "Y-m-d",
                mode: ed_date !== null ? "range" : "range",
                onChange: function (selectedDates, dateStr, instance) {
                    var date_range = dateStr;
                    var dates = date_range.split("to");
                    if (dates.length > 1) {
                        document.getElementById('event-time').setAttribute("hidden", true);
                    } else {
                        //document.getElementById("timepicker1").parentNode.classList.remove("d-none");
                        //document.getElementById("timepicker1").classList.replace("d-none", "d-block");
                        //document.getElementById("timepicker2").parentNode.classList.remove("d-none");
                        //document.getElementById("timepicker2").classList.replace("d-none", "d-block");
                        document.getElementById('event-time').removeAttribute("hidden");
                    }
                },
            });
            document.getElementById("event-start-date-tag").innerHTML = r_date;

            var gt_time = getTime(selectedEvent.start);
            var ed_time = getTime(selectedEvent.end);

            if (gt_time == ed_time) {
                //document.getElementById('event-time').setAttribute("hidden", true);
                //flatpickr(document.getElementById("timepicker1"), {
                //    enableTime: true,
                //    noCalendar: true,
                //    dateFormat: "H:i",
                //});
                //flatpickr(document.getElementById("timepicker2"), {
                //    enableTime: true,
                //    noCalendar: true,
                //    dateFormat: "H:i",
                //});
            }
            else {
                //document.getElementById('event-time').removeAttribute("hidden");
                //flatpickr(document.getElementById("timepicker1"), {
                //    enableTime: true,
                //    noCalendar: true,
                //    dateFormat: "H:i",
                //    defaultDate: gt_time
                //});

                //flatpickr(document.getElementById("timepicker2"), {
                //    enableTime: true,
                //    noCalendar: true,
                //    dateFormat: "H:i",
                //    defaultDate: ed_time
                //});
                //document.getElementById("event-timepicker1-tag").innerHTML = tConvert(gt_time);
                //document.getElementById("event-timepicker2-tag").innerHTML = tConvert(ed_time);
            }
            newEventData = null;
            modalTitle.innerText = selectedEvent.title;

            // formEvent.classList.add("view-event");
            document.getElementById('btn-delete-event').removeAttribute('hidden');
        },
        dateClick: function (info) {
            addNewEvent(info);
        },
        events: defaultEvents,
        eventReceive: function (info) {
            var newid = parseInt(info.event.id);
            var newEvent = {
                id: newid,
                title: info.event.title,
                start: info.event.start,
                allDay: info.event.allDay,
                className: info.event.classNames[0]
            };
            defaultEvents.push(newEvent);
            /*   upcomingEvent(defaultEvents);*/
        },
        eventDrop: function (info) {
            var indexOfSelectedEvent = defaultEvents.findIndex(function (x) {
                return x.id == info.event.id
            });
            if (defaultEvents[indexOfSelectedEvent]) {
                defaultEvents[indexOfSelectedEvent].title = info.event.title;
                defaultEvents[indexOfSelectedEvent].start = info.event.start;
                defaultEvents[indexOfSelectedEvent].end = (info.event.end) ? info.event.end : null;
                defaultEvents[indexOfSelectedEvent].allDay = info.event.allDay;
                defaultEvents[indexOfSelectedEvent].className = info.event.classNames[0];
                defaultEvents[indexOfSelectedEvent].description = (info.event._def.extendedProps.description) ? info.event._def.extendedProps.description : '';
                defaultEvents[indexOfSelectedEvent].location = (info.event._def.extendedProps.location) ? info.event._def.extendedProps.location : '';
            }
        }
    });
    $("#drpmachinenameforselection").change(function () {
        var selectedMachines = $(this).val();
        fetchEventsFromBackend(selectedMachines);
        var filteredEvents = defaultEvents.filter(function (event) {
            // Assuming you have a property named 'machine_name' in the event
            return selectedMachines.includes(event.machine_name);
        });
        calendar.removeAllEvents();
        calendar.addEventSource(filteredEvents);
        upcomingEvent(filteredEvents);
    });
    fetchEventsFromBackend();
    calendar.render();
});


function machinenamedropdown(machineNames) {
    console.log("Machine names data:", machineNames);
    $("#drpmachinename").empty().removeClass("d-none");

    $.each(machineNames, function (index, value) {
        $("#drpmachinename").append('<option value="' + value.Machine_Name + '">' + value.Machine_Name + '</option>');
    });
}

function machinenamedropdownforall(machineNames) {
    console.log("Machine names data:", machineNames);
    $("#drpmachinenameforselection").empty().removeClass("d-none");
    $("#drpmachinenameforselection").append('<option value="" selected>Select</option>');

    $.each(machineNames, function (index, value) {
        $("#drpmachinenameforselection").append('<option value="' + value.Machine_Name + '">' + value.Machine_Name + '</option>');
    });

}

function eventClicked() {
    document.getElementById('form-event').classList.add("view-event");
    document.getElementById("event-job").classList.replace("d-block", "d-none");
    document.getElementById("event-part").classList.replace("d-block", "d-none");
    document.getElementById("event-category").classList.replace("d-block", "d-none");
    //document.getElementById("event-start-date").parentNode.classList.add("d-none");
    //document.getElementById("event-start-date").classList.replace("d-block", "d-none");
    document.getElementById('event-time').setAttribute("hidden", true);
    //document.getElementById("timepicker1").parentNode.classList.add("d-none");
    //document.getElementById("timepicker1").classList.replace("d-block", "d-none");
    //document.getElementById("timepicker2").parentNode.classList.add("d-none");
    //document.getElementById("timepicker2").classList.replace("d-block", "d-none");
    document.getElementById("event-location").classList.replace("d-block", "d-none");
    document.getElementById("event-description").classList.replace("d-block", "d-none");
    /*  document.getElementById("event-start-date-tag").classList.replace("d-none", "d-block");*/
    //document.getElementById("event-timepicker1-tag").classList.replace("d-none", "d-block");
    //document.getElementById("event-timepicker2-tag").classList.replace("d-none", "d-block");
    document.getElementById("event-location-tag").classList.replace("d-none", "d-block");
    document.getElementById("event-description-tag").classList.replace("d-none", "d-block");
    document.getElementById('btn-save-event').setAttribute("hidden", true);
}

function editEvent(data) {
    var data_id = data.getAttribute("data-id");
    if (data_id == 'new-event') {
        document.getElementById('modal-title').innerHTML = "";
        document.getElementById('modal-title').innerHTML = "Add Event";
        document.getElementById("btn-save-event").innerHTML = "Add Event";
        eventTyped();
    } else if (data_id == 'edit-event') {
        data.innerHTML = "Cancel";
        data.setAttribute("data-id", 'cancel-event');
        document.getElementById("btn-save-event").innerHTML = "Update Event";
        data.removeAttribute("hidden");
        eventTyped();
    } else {
        data.innerHTML = "Edit";
        data.setAttribute("data-id", 'edit-event');
        eventClicked();
    }
}

function eventTyped() {
    document.getElementById('form-event').classList.remove("view-event");
    document.getElementById("event-job").classList.replace("d-none", "d-block");
    document.getElementById("event-part").classList.replace("d-none", "d-block");
    document.getElementById("event-category").classList.replace("d-none", "d-block");
    //document.getElementById("event-start-date").parentNode.classList.remove("d-none");
    //document.getElementById("event-start-date").classList.replace("d-none", "d-block");
    //document.getElementById("timepicker1").parentNode.classList.remove("d-none");
    //document.getElementById("timepicker1").classList.replace("d-none", "d-block");
    //document.getElementById("timepicker2").parentNode.classList.remove("d-none");
    //document.getElementById("timepicker2").classList.replace("d-none", "d-block");
    document.getElementById("event-location").classList.replace("d-none", "d-block");
    document.getElementById("event-description").classList.replace("d-none", "d-block");
    document.getElementById("event-start-date-tag").classList.replace("d-block", "d-none");
    //document.getElementById("event-timepicker1-tag").classList.replace("d-block", "d-none");
    //document.getElementById("event-timepicker2-tag").classList.replace("d-block", "d-none");
    document.getElementById("event-location-tag").classList.replace("d-block", "d-none");
    document.getElementById("event-description-tag").classList.replace("d-block", "d-none");
    document.getElementById('btn-save-event').removeAttribute("hidden");
}

// upcoming Event
function upcomingEvent(events, searchTerm = "") {
    events.sort(function (event1, event2) {
        return new Date(event1.start) - new Date(event2.start);
    });

    document.getElementById("upcoming-event-list").innerHTML = '';

    var filteredEvents = events.filter(function (event) {
        var eventTitle = event.title.toLowerCase();
        var jobNum = event.extendedProps && event.extendedProps.jobNum ? event.extendedProps.jobNum.toLowerCase() : "";
        var partNum = event.extendedProps && event.extendedProps.partNum ? event.extendedProps.partNum.toLowerCase() : "";

        return (
            eventTitle.includes(searchTerm.toLowerCase()) ||
            jobNum.includes(searchTerm.toLowerCase()) ||
            partNum.includes(searchTerm.toLowerCase())
        );
    });

    filteredEvents.forEach(function (event) {
        var title = event.title;
        var startDate = formatDate(event.start);
        var endDate = formatDate(event.end);
        var startTime = getTime(event.start);
        var endTime = getTime(event.end);
        var category = event.className ? event.className.split("-")[2] : '';
        var description = event.description || "";

        var jobNum = event.extendedProps && event.extendedProps.jobNum ? event.extendedProps.jobNum : "N/A";
        var partNum = event.extendedProps && event.extendedProps.partNum ? event.extendedProps.partNum : "N/A";
        var op = event.extendedProps && event.extendedProps.op ? event.extendedProps.op : "N/A";

        var eventHtml = `
            <div class='card mb-3'>
                <div class='card-body'>
                    <div class='d-flex mb-3'>
                        <div class='flex-shrink-0'>
                            <div class='badge badge-soft-primary' style='font-size=20px;'> ${title}</div>
                            <div class='badge badge-soft-primary' style='font-size=20px;'> Job No: ${jobNum}</div><br />
                            <div class='badge badge-soft-primary' style='font-size=20px;'> Part No: ${partNum}</div>
                        </div>
                        <div class='ms-auto'>
                            <button onclick='editEventModal(${JSON.stringify(event)})'>Edit</button>
                        </div>
                    </div>
                    <h6 class='card-title fs-16'><i class='mdi mdi-checkbox-blank-circle me-2 text-${category[2]}'></i> Start Date ${startDate}</h6>
                    <h6 class='card-title fs-16'><i class='mdi mdi-checkbox-blank-circle me-2 text-${category[2]}'></i> End Date ${endDate}</h6>
                </div>
            </div>
        `;
        document.getElementById("upcoming-event-list").innerHTML += eventHtml;
    });
}

function editEventModal(event) {
    document.getElementById("event-title").value = event.title;
    document.getElementById("event-job").value = event.extendedProps.jobNum || "";
    document.getElementById("event-part").value = event.extendedProps.partNum || "";
    $("#event-modal").modal("show");
}


function formatDate(date) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}


function getTime(date) {
    date = new Date(date);
    const hours = date.getHours();
    const minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    return hours + ':' + minutes;
}

function tConvert(time) {
    var t = time.split(":");
    var hours = t[0];
    var minutes = t[1];
    var newformat = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return (hours + ':' + minutes + ' ' + newformat);
}

var str_dt = function formatDate(date) {
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var d = new Date(date),
        month = '' + monthNames[(d.getMonth())],
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    return [day + " " + month, year].join(',');
};