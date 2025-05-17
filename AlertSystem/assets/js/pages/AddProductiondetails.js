
document.getElementById("btnverifyuserdetails").addEventListener("click", verifyuserdata);
function verifyuserdata() {
    Swal.fire({
        title: "Are you sure?",
        text: "You want to do Production for this Machine!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonClass: 'btn btn-primary w-xs me-2 mt-2',
        cancelButtonClass: 'btn btn-danger w-xs mt-2',
        confirmButtonText: "Yes",
        buttonsStyling: false,
        showCloseButton: true
    }).then(function (result) {
        if (result.value) {
            var empID = $("#txtemployeeid").val();
            var Shift = $("#drpshift").val();
            var machine = $("#event-category").val();
            var machinename = $("#drpmachinename").val();


            $.get("/Forms/verifylogger", { empID: empID }, function (data) {
                $.each(data, function (index, row) {
                    if (row.Person_Type == "Operator") {
                        $("#divforoperator").show();
                        $("#divforprogrammer").hide();
                    }
                    else if (row.Person_Type == "Programmer") {
                        $("#divforprogrammer").show();
                        $("#divforoperator").hide();
                    }
                });
            });

            $.get("/Forms/getplaaneddata", { machinename: machinename }, function (data) {
                if (data.length > 0) {
                    $.each(data, function (index, rowbd) {
                        $("#txtjobno").val(rowbd.JobNum);
                        $("#txtpartname").val(rowbd.PartNum);
                        $("#event-rev").val(rowbd.revision);
                        $("#txtjobqty").val(rowbd.Job_Qty);
                        $("#txtstdsetuptime").val(rowbd.Setup_time);
                        $("#txtstdcycletime").val(rowbd.Cycle_Time);
                        $("#txtokqty").val(rowbd.Ok_Qty);
                        $("#txtstdsetuptime").val(rowbd.Setup_time);
                        $("#txtstdcycletime").val(rowbd.Cycle_Time);
                        $("#txtjobqty").val(rowbd.Job_Qty);
                        $("#txtcalculatedtime").val(rowbd.Completed_Day);
                        var JobNum = $("#txtjobno").val();
                        var status = rowbd.status;
                        var lbltext = "";

                        var jobnum = $("#txtjobno").val();
                        var partnum = $("#txtpartname").val();
                        var revision = $("#txtrevisionno").val();
                        var txtloginid = $("#txtemployeeid").val();
                        var shft = $("#drpshift").val();
                        var machine = $("#drpmachinename").val();
                        alert(status);
                        $.get("/Apps/GetOpno", { JobNum: JobNum }, function (data) {
                            $("#event-op").empty();
                            $.each(data, function (index, row) {
                                $("#event-op").append("<option value='" + row.OprSeq + "'>" + row.OprSeq + "-" + row.ResourceGrpID + "</option>")
                                $('#event-op').val(rowbd.OP);
                            });
                            var Op_No = $('#event-op').val();
                            $.get("/Forms/getdetails", { Op_No: Op_No, jobnum: jobnum, machine: machine }, function (data) {
                                $.each(data, function (i, item) {
                                    var uploaddate = moment(item.uploaddate);
                                    var startTime = moment(uploaddate);
                                    $("#divforsetup").show();
                                    if (status == "Planning") {
                                        lbltext = "Please Start Setup";
                                        $("#chksetupstart").prop("disabled", false);
                                        $("#chksetupcontinue").prop("disabled", true);
                                        $("#chksetupcomplete").prop("disabled", true);
                                    }
                                    else if (status == "Setup Start") {
                                        lbltext = "Setup is Running";
                                        $("#chksetupstart").prop("disabled", true);
                                        $("#chksetupcontinue").prop("disabled", false);
                                        $("#chksetupcomplete").prop("disabled", true);
                                        $("#chksetupstart").prop("checked", true);
                                        var timerInterval = setInterval(function () {
                                            var currentTime = moment();
                                            var elapsedTime = moment.duration(currentTime.diff(startTime));
                                            var formattedTime = elapsedTime.hours() + "h " + elapsedTime.minutes() + "m " + elapsedTime.seconds() + "s";

                                            $("#lblsetuptimings").text(formattedTime);
                                        }, interval);
                                        $("#lblmachinestatus").text(lbltext);
                                    }
                                    else if (status == "Setup Continue") {
                                        lbltext = "Setup is Continue for the Next Shift";
                                        $("#chksetupstart").prop("disabled", true);
                                        $("#chksetupcontinue").prop("disabled", false);
                                        $("#chksetupcomplete").prop("disabled", false);
                                        $("#chksetupstart").prop("checked", true);
                                        $("#chksetupcontinue").prop("checked", true);

                                        var timerInterval = setInterval(function () {
                                            var currentTime = moment();
                                            var elapsedTime = moment.duration(currentTime.diff(startTime));
                                            var formattedTime = elapsedTime.hours() + "h " + elapsedTime.minutes() + "m " + elapsedTime.seconds() + "s";

                                            $("#lblsetuptimings").text(formattedTime);
                                        }, interval);
                                        $("#lblmachinestatus").text(lbltext);
                                    }
                                    else if (status == "Setup End") {
                                        lbltext = "Setup is Completed";
                                        $("#chksetupstart").prop("disabled", true);
                                        $("#chksetupcontinue").prop("disabled", true);
                                        $("#chksetupcomplete").prop("disabled", true);
                                        $("#chksetupstart").prop("checked", true);
                                        $("#chksetupcontinue").prop("checked", true);
                                        $("#chksetupstart").prop("checked", true);
                                        $("#chksetupcomplete").prop("checked", true);
                                        $("#lblsetuptimings").hide();
                                        $("#lblmachinestatus").hide();
                                       
                                        var currentTime = moment();
                                        $.get("/Forms/getdetailsforend", { Op_No: Op_No, jobnum: jobnum, machine: machine }, function (enddata) {
                                            $.each(enddata, function (i, item) {
                                                var setupenddate = moment(item.uploaddate);
                                                var totalElapsedTime = moment.duration(setupenddate.diff(startTime));
                                                var totalFormattedTime = totalElapsedTime.hours() + "h " + totalElapsedTime.minutes() + "m " + totalElapsedTime.seconds() + "s";
                                                $("#lblsetupcompletetime").text(" - Setup Completed in " + totalFormattedTime);
                                                $("#divforresetting").show();
                                            });
                                        });
                                        $("#divforsetup").hide();
                                        $("#divsetupdata").show();
                                        $("#divproductionplans").show();
                                    }
                                });
                            });
                           
                            $.get("/Forms/getofresettingdetails", { Op_No: Op_No, jobnum: jobnum, machine: machine }, function (data) {
                                $.each(data, function (i, item) {
                                    var uploaddate = moment(item.uploaddate);
                                    var startTime = moment(uploaddate);
                                    if (status == "Planning") {
                                        lbltext = "Please Start Setup";
                                        $("#chkresettingstart").prop("disabled", false);
                                        $("#chkresettingcontinue").prop("disabled", true);
                                        $("#chkresettingcomplete").prop("disabled", true);
                                    }
                                    else if (status == "Resetting Start") {
                                        lbltext = "Resetting is Running";
                                        $("#chkresettingstart").prop("disabled", true);
                                        $("#chkresettingcontinue").prop("disabled", false);
                                        $("#chkresettingcomplete").prop("disabled", true);
                                        $("#chkresettingstart").prop("checked", true);
                                        var timerInterval = setInterval(function () {
                                            var currentTime = moment();
                                            var elapsedTime = moment.duration(currentTime.diff(startTime));
                                            var formattedTime = elapsedTime.hours() + "h " + elapsedTime.minutes() + "m " + elapsedTime.seconds() + "s";

                                            $("#lblsetuptimings").text(formattedTime);
                                        }, interval);
                                        $("#lblmachinestatus").text(lbltext);
                                    }
                                    else if (status == "Resetting Continue") {
                                        lbltext = "Resetting is Continue for the Next Shift";
                                        $("#chkresettingstart").prop("disabled", true);
                                        $("#chkresettingcontinue").prop("disabled", false);
                                        $("#chkresettingcomplete").prop("disabled", false);
                                        $("#chkresettingstart").prop("checked", true);
                                        $("#chkresettingcontinue").prop("checked", true);

                                        var timerInterval = setInterval(function () {
                                            var currentTime = moment();
                                            var elapsedTime = moment.duration(currentTime.diff(startTime));
                                            var formattedTime = elapsedTime.hours() + "h " + elapsedTime.minutes() + "m " + elapsedTime.seconds() + "s";

                                            $("#lblsetuptimings").text(formattedTime);
                                        }, interval);
                                        $("#lblmachinestatus").text(lbltext);
                                    }
                                    else if (status == "Resetting End") {
                                        lbltext = "Resetting is Completed";
                                        $("#chkresettingstart").prop("disabled", true);
                                        $("#chkresettingcontinue").prop("disabled", true);
                                        $("#chkresettingcomplete").prop("disabled", true);
                                        $("#chkresettingstart").prop("checked", true);
                                        $("#chkresettingcontinue").prop("checked", true);
                                        $("#chkresettingstart").prop("checked", true);
                                        $("#chkresettingcomplete").prop("checked", true);
                                        var currentTime = moment();
                                        $.get("/Forms/getdetailsforendresetting", { Op_No: Op_No, jobnum: jobnum, machine: machine }, function (enddata) {
                                            $.each(enddata, function (i, item) {
                                                var setupenddate = moment(item.uploaddate);
                                                var totalElapsedTime = moment.duration(setupenddate.diff(startTime));
                                                var totalFormattedTime = totalElapsedTime.hours() + "h " + totalElapsedTime.minutes() + "m " + totalElapsedTime.seconds() + "s";
                                                $("#lblresettingcompletetime").text(" - Resetting Completed in " + totalFormattedTime);
                                                $("#divforresetting").show();
                                            });
                                        });
                                    }
                                });
                            });

                        });
                    });
                    Swal.fire({
                        title: 'Updated!',
                        text: 'Planning for this machine is updated.',
                        icon: 'success',
                        confirmButtonClass: 'btn btn-primary w-xs mt-2',
                        buttonsStyling: false
                    });
                } else {
                    $("#txtjobno").val("");
                    $("#txtpartname").val("");
                    $("#event-rev").val("");
                    $("#event-op").val("");
                    $("#txtjobqty").val("");
                    $("#txtstdsetuptime").val("");
                    $("#Cycle_Time").val("");
                    $("#txtokqty").val("");
                    $("#txtstdsetuptime").val("");
                    $("#txtstdcycletime").val("");
                    $("#txtjobqty").val("");
                    $("#txtcalculatedtime").val("");
                    Swal.fire({
                        title: 'No Data Found',
                        text: 'There is no planning data available for this machine.',
                        icon: 'error',
                        confirmButtonClass: 'btn btn-primary w-xs mt-2',
                        buttonsStyling: false
                    });
                }
            });
        }
    });
}


function updateUIWithData(status) {
    var machinename = $("#drpmachinename").val();
    $.get("/Forms/getplaaneddata", { machinename: machinename }, function (data) {
        if (data.length > 0) {
            $.each(data, function (index, rowbd) {

                $("#txtcalculatedtime").val(rowbd.Completed_Day);
                var JobNum = $("#txtjobno").val();
                var status = rowbd.status;
                var lbltext = "";
                if (status == "Planning") {
                    lbltext = "Please Start Setup";
                    $("#chksetupstart").prop("disabled", false);
                    $("#chksetupcontinue").prop("disabled", true);
                    $("#chksetupcomplete").prop("disabled", true);
                }
                else if (status == "Setup Start") {
                    lbltext = "Setup is Running";
                    $("#chksetupstart").prop("disabled", true);
                    $("#chksetupcontinue").prop("disabled", false);
                    $("#chksetupcomplete").prop("disabled", true);
                }
                else if (status == "Setup Continue") {
                    lbltext = "Setup is Continue for the Next Shift";
                    $("#chksetupstart").prop("disabled", true);
                    $("#chksetupcontinue").prop("disabled", false);
                    $("#chksetupcomplete").prop("disabled", false)
                }
                else if (status == "Setup End") {
                    lbltext = "Setup is Completed";
                    $("#chksetupstart").prop("disabled", true);
                    $("#chksetupcontinue").prop("disabled", true);
                    $("#chksetupcomplete").prop("disabled", true);
                }
                else if (status == "Resetting Start") {
                    lbltext = "ReSetting is Running";
                }
                else if (status == "Resetting Continue") {
                    lbltext = "Resetting is Continue for the Next Shift";
                }
                else if (status == "Resetting End") {
                    lbltext = "Resetting is Completed";
                }
                $("#lblmachinestatus").text(lbltext);
                alert(lbltext);
            });

        } else {
            $("#txtjobno").val("");
            $("#txtpartname").val("");
            $("#event-rev").val("");
            $("#event-op").val("");
            $("#txtjobqty").val("");
            $("#txtstdsetuptime").val("");
            $("#Cycle_Time").val("");
            $("#txtokqty").val("");
            $("#txtstdsetuptime").val("");
            $("#txtstdcycletime").val("");
            $("#txtjobqty").val("");
            $("#txtcalculatedtime").val("");
            Swal.fire({
                title: 'No Data Found',
                text: 'There is no planning data available for this machine.',
                icon: 'error',
                confirmButtonClass: 'btn btn-primary w-xs mt-2',
                buttonsStyling: false
            });
        }
    });
}
function calculatedata() {

    var loginid = $("#txtemployeeid").val();
    var jobnum = $("#txtjobno").val();
    var partnum = $("#txtpartname").val();
    var revision = $("#event-rev").val();
    var txtloginid = $("#txtemployeeid").val();
    var Op_No = $("#event-op").val();
    var shft = $("#drpshift").val();
    var actualcycletime = $("#txtcyletime").val();
    var othertime = $("#txtothertime").val();
    var loadingtime = $("#txtlodingtime").val();
    var rejectqty = $("#txtrejectedqtyofsetup").val();
    var okqty = $("#txtokqtyofsetup").val();
    var machine = $("#drpmachinename").val();

    var _setupadded = {};
    _setupadded.JobNum = jobnum;
    _setupadded.PartNum = partnum;
    _setupadded.RevNo = revision;
    _setupadded.OP = Op_No;
    _setupadded.Shift = shft;
    _setupadded.PersonID = loginid;
    _setupadded.Cycle_Time = actualcycletime;
    _setupadded.Loading_Time = loadingtime;
    _setupadded.Other_Time = othertime;
    _setupadded.OK_QTY = okqty;
    _setupadded.Reject_Qty = rejectqty;
    _setupadded.Machine = machine;

    $.ajax({
        type: "POST",
        url: "/Forms/Insersetupdetails",
        data: JSON.stringify(_setupadded),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var lbltext = "";

           
            $.get("/Forms/Getfinaltime", { Op_No: Op_No, jobnum: jobnum, machine: machine }, function (finaldata) {
                $('#tblsetupdtls tbody').empty();
                $.each(finaldata, function (mj, fnl) {

                    var setupstart = moment(fnl.Setup_Start);
                    var ds = new Date(setupstart).toLocaleDateString("en-IN");
                    var ts = new Date(setupstart).toLocaleTimeString("en-IN");

                    var setupcontinue = moment(fnl.Setup_Continue);
                    var dc = new Date(setupcontinue).toLocaleDateString("en-IN");
                    var tc = new Date(setupcontinue).toLocaleTimeString("en-IN");

                    var setupend = moment(fnl.Setup_End);
                    var de = new Date(setupend).toLocaleDateString("en-IN");
                    var te = new Date(setupend).toLocaleTimeString("en-IN");

                    var rows = "<tr>"
                        + "<td>" + fnl.Setup_ID + "</td>"
                        + "<td>" + fnl.Shift + "</td>"
                        + "<td>" + ds + " " + ts + "</td>"
                        + "<td>" + dc + " " + tc + "</td>"
                        + "<td>" + de + " " + te + "</td>"
                        + "<td>" + fnl.Person + "</td>"
                        + "<td>" + fnl.Setup_Time + "</td>"
                        + "<td>" + fnl.Cycle_Time + "</td>"
                        + "<td>" + fnl.Loading_Time + "</td>"
                        + "<td>" + fnl.Other_Time + "</td>"
                        + "<td>" + fnl.OK_Qty + "</td>"
                        + "<td>" + fnl.Reject_Qty + "</td>"
                        + "</tr>";
                    $('#tblsetupdtls tbody').append(rows);

                    if (fnl.Setup_ID == "Setup") {
                        $("#divforsetup").hide();
                        $.get("/Forms/getdetails", { Op_No: Op_No, jobnum: jobnum, machine: machine }, function (data) {
                            var timerInterval;
                            var interval = 1000;
                            var totalItems = data.length;
                            var startTime = "";
                            $.each(data, function (i, item) {
                                var uploaddate = moment(item.uploaddate);

                                lbltext = "Setup is Completed";
                                $("#chksetupstart").prop("disabled", true);
                                $("#chksetupcontinue").prop("disabled", true);
                                $("#chksetupcomplete").prop("disabled", true);
                                $("#chksetupstart").prop("checked", true);
                                $("#chksetupcontinue").prop("checked", true);
                                $("#chksetupstart").prop("checked", true);
                                $("#chksetupcomplete").prop("checked", true);
                                $("#lblmachinestatus").text(lbltext);
                                startTime = moment(uploaddate);

                                timerInterval = setInterval(function () {
                                    var currentTime = moment();
                                    var elapsedTime = moment.duration(currentTime.diff(startTime));
                                    var formattedTime = elapsedTime.hours() + "h " + elapsedTime.minutes() + "m " + elapsedTime.seconds() + "s";

                                    $("#lblsetuptimings").text(formattedTime);
                                }, interval);
                            });

                            setTimeout(function () {
                                clearInterval(timerInterval);
                                var totalElapsedTime = moment.duration(moment().diff(startTime));
                                var totalFormattedTime = totalElapsedTime.hours() + "h " + totalElapsedTime.minutes() + "m " + totalElapsedTime.seconds() + "s";
                                $("#lblsetupendtimings").text("Total Time: " + totalFormattedTime);
                                $("#lblsetupcompletetime").text(" - Setup Completed in " + totalFormattedTime);
                                $("#lblsetuptimings").hide();
                                $("#divforsetupcomplete").hide();
                                $("#divsetupdata").show();
                            }, interval * totalItems);



                        });

                    }
                    else {
                        $("#divforsetup").hide();
                        $("#divforresettingcomplete").hide();
                        $("#divforresetting").hide();
                        $("#lblresettingcompletetime").text(" - Resetting is Completed in " + totalFormattedTime);
                        $.get("/Forms/getofresettingdetails", { Op_No: Op_No, jobnum: jobnum, machine: machine }, function (data) {
                            var timerInterval;
                            var interval = 1000;
                            var totalItems = data.length;
                            var startTime = "";
                            $.each(data, function (i, item) {
                                var uploaddate = moment(item.uploaddate);

                                lbltext = "Setup is Completed";
                                $("#chksetupstart").prop("disabled", true);
                                $("#chksetupcontinue").prop("disabled", true);
                                $("#chksetupcomplete").prop("disabled", true);
                                $("#chksetupstart").prop("checked", true);
                                $("#chksetupcontinue").prop("checked", true);
                                $("#chksetupstart").prop("checked", true);
                                $("#chksetupcomplete").prop("checked", true);
                                $("#lblmachinestatus").text(lbltext);
                                startTime = moment(uploaddate);

                                timerInterval = setInterval(function () {
                                    var currentTime = moment();
                                    var elapsedTime = moment.duration(currentTime.diff(startTime));
                                    var formattedTime = elapsedTime.hours() + "h " + elapsedTime.minutes() + "m " + elapsedTime.seconds() + "s";

                                    $("#lblsetuptimings").text(formattedTime);
                                }, interval);
                            });

                            setTimeout(function () {
                                clearInterval(timerInterval);
                                var totalElapsedTime = moment.duration(moment().diff(startTime));
                                var totalFormattedTime = totalElapsedTime.hours() + "h " + totalElapsedTime.minutes() + "m " + totalElapsedTime.seconds() + "s";
                                $("#lblsetupendtimings").text("Total Time: " + totalFormattedTime);
                                $("#lblsetupcompletetime").text(" - Setup Completed in " + totalFormattedTime);
                                $("#lblsetuptimings").hide();
                                $("#divforsetupcomplete").hide();
                                $("#divsetupdata").show();
                            }, interval * totalItems);
                        });

                    }
                })
            });
        },
        error: function (response) {
            console.log(response);
        }
    });
}



$("body").on("click", "#btnAddqtyrejected", function () {
    var txtrejectedqty = $("#txtrejectedqty");
    var drpreason = $("#drpreason");
    var jobnumber = $("#txtjobno");
    var Op_No = $("#event-op");
    var operator = $("#txtemployeeid");
    var shiftforprddata = $("#drpshift");
    var _rejectedqty = {};
    _rejectedqty.qty = txtrejectedqty.val();
    _rejectedqty.reason = drpreason.val();
    _rejectedqty.JobNum = jobnumber.val();
    _rejectedqty.OpNo = Op_No.val();
    _rejectedqty.Shift = shiftforprddata.val();
    _rejectedqty.Operator = operator.val();
    $.ajax({
        type: "POST",
        url: "/Home/Insertrejectedqty",
        data: JSON.stringify(_rejectedqty),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            alert("Added");
        },
        error: function (response) {
            console.log(response);
        }
    });
});


$(document).ready(function () {
    $("#chksetupstart").on("click", function () {

        if ($(this).prop("checked")) {
            if ($(this).is(":checked")) {
                var machinename = $("#drpmachinename").val();
                var _setupadded = {};
                _setupadded.JobNum = $("#txtjobno").val();
                _setupadded.PartNum = $("#txtpartname").val();
                _setupadded.RevNo = $("#txtrevisionno").val();
                _setupadded.OP = $("#event-op").val();
                _setupadded.Shift = $("#drpshift").val();
                _setupadded.setup = "Setup Continue";
                _setupadded.PersonID = $("#txtemployeeid").val();
                _setupadded.Machine = $("#drpmachinename").val();

                $.ajax({
                    type: "POST",
                    url: "/Forms/yessetupstart",
                    data: JSON.stringify(_setupadded),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        updateUIWithData("Setup Start");
                        $.get("/Forms/getplaaneddata", { machinename: machinename }, function (data) {
                            if (data.length > 0) {
                                $.each(data, function (index, rowbd) {
                                    $("#txtjobno").val(rowbd.JobNum);
                                    $("#txtpartname").val(rowbd.PartNum);
                                    $("#event-rev").val(rowbd.revision);
                                    $("#txtjobqty").val(rowbd.Job_Qty);
                                    $("#txtstdsetuptime").val(rowbd.Setup_time);
                                    $("#txtstdcycletime").val(rowbd.Cycle_Time);
                                    $("#txtokqty").val(rowbd.Ok_Qty);
                                    $("#txtstdsetuptime").val(rowbd.Setup_time);
                                    $("#txtstdcycletime").val(rowbd.Cycle_Time);
                                    $("#txtjobqty").val(rowbd.Job_Qty);
                                    $("#txtcalculatedtime").val(rowbd.Completed_Day);
                                    var JobNum = $("#txtjobno").val();
                                    var status = rowbd.status;
                                    var lbltext = "";

                                    var jobnum = $("#txtjobno").val();
                                    var partnum = $("#txtpartname").val();
                                    var revision = $("#txtrevisionno").val();
                                    var txtloginid = $("#txtemployeeid").val();
                                    var shft = $("#drpshift").val();
                                    var machine = $("#drpmachinename").val();
                                    $.get("/Apps/GetOpno", { JobNum: JobNum }, function (data) {
                                        $("#event-op").empty();
                                        $.each(data, function (index, row) {
                                            $("#event-op").append("<option value='" + row.OprSeq + "'>" + row.OprSeq + "-" + row.ResourceGrpID + "</option>")
                                            $('#event-op').val(rowbd.OP);
                                        });
                                        var Op_No = $('#event-op').val();
                                        $.get("/Forms/getdetails", { Op_No: Op_No, jobnum: jobnum, machine: machine }, function (data) {
                                            $.each(data, function (i, item) {
                                                var uploaddate = moment(item.uploaddate);
                                                if (status == "Planning") {
                                                    lbltext = "Please Start Setup";
                                                    $("#chksetupstart").prop("disabled", false);
                                                    $("#chksetupcontinue").prop("disabled", true);
                                                    $("#chksetupcomplete").prop("disabled", true);
                                                }
                                                else if (status == "Setup Start") {
                                                    lbltext = "Setup is Running";
                                                    $("#chksetupstart").prop("disabled", true);
                                                    $("#chksetupcontinue").prop("disabled", false);
                                                    $("#chksetupcomplete").prop("disabled", true);
                                                    $("#chksetupstart").prop("checked", true);
                                                }
                                                else if (status == "Setup Continue") {
                                                    lbltext = "Setup is Continue for the Next Shift";
                                                    $("#chksetupstart").prop("disabled", true);
                                                    $("#chksetupcontinue").prop("disabled", false);
                                                    $("#chksetupcomplete").prop("disabled", false);
                                                    $("#chksetupstart").prop("checked", true);
                                                    $("#chksetupcontinue").prop("checked", true);
                                                }
                                                else if (status == "Setup Completed") {
                                                    lbltext = "Setup is Completed";
                                                    $("#chksetupstart").prop("disabled", true);
                                                    $("#chksetupcontinue").prop("disabled", true);
                                                    $("#chksetupcomplete").prop("disabled", true);
                                                    $("#chksetupstart").prop("checked", true);
                                                    $("#chksetupcontinue").prop("checked", true);
                                                    $("#chksetupstart").prop("checked", true);
                                                    $("#chksetupcomplete").prop("checked", true);
                                                }
                                                else if (status == "Resetting Start") {
                                                    lbltext = "ReSetting is Running";
                                                }
                                                else if (status == "Resetting Continue") {
                                                    lbltext = "Resetting is Continue for the Next Shift";
                                                }
                                                else if (status == "Resetting Completed") {
                                                    lbltext = "Resetting is Completed";
                                                }

                                                $("#lblmachinestatus").text(lbltext);
                                                var startTime = moment(uploaddate);
                                                var interval = 1000;

                                                var timerInterval = setInterval(function () {
                                                    var currentTime = moment();
                                                    var elapsedTime = moment.duration(currentTime.diff(startTime));
                                                    var formattedTime = elapsedTime.hours() + "h " + elapsedTime.minutes() + "m " + elapsedTime.seconds() + "s";

                                                    $("#lblsetuptimings").text(formattedTime);
                                                }, interval);
                                            });
                                        });
                                    });
                                });
                            } else {

                            }
                        });
                    },
                    error: function (response) {
                        console.log(response);
                    }
                });
            }
        } else {

        }
    });
});
$(document).ready(function () {
    $("#chksetupcontinue").on("click", function () {
        if ($(this).prop("checked")) {
            if ($(this).is(":checked")) {
                var _setupadded = {};
                _setupadded.JobNum = $("#txtjobno").val();
                _setupadded.PartNum = $("#txtpartname").val();
                _setupadded.RevNo = $("#txtrevisionno").val();
                _setupadded.OP = $("#event-op").val();
                _setupadded.Shift = $("#drpshift").val();
                _setupadded.setup = "Setup Continue";
                _setupadded.PersonID = $("#txtemployeeid").val();
                _setupadded.Machine = $("#drpmachinename").val();

                $.ajax({
                    type: "POST",
                    url: "/Forms/yessetupcontinue",
                    data: JSON.stringify(_setupadded),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        updateUIWithData("Setup Continue");
                    },
                    error: function (response) {
                        console.log(response);
                    }
                });
            }
        } else {

        }
    });
});
$(document).ready(function () {
    $("#chksetupcomplete").on("click", function () {
        if ($(this).prop("checked")) {
            if ($(this).is(":checked")) {
                $("#divforsetupcomplete").show();
                $("#divforresetting").show();
            }
        } else {
            $("#divforsetupcomplete").hide();
        }
    });
});

$(document).ready(function () {
    $("#chkresettingstart").on("click", function () {

        if ($(this).prop("checked")) {
            if ($(this).is(":checked")) {
                var machinename = $("#drpmachinename").val();
                var _setupadded = {};
                _setupadded.JobNum = $("#txtjobno").val();
                _setupadded.PartNum = $("#txtpartname").val();
                _setupadded.RevNo = $("#txtrevisionno").val();
                _setupadded.OP = $("#event-op").val();
                _setupadded.Shift = $("#drpshift").val();
                _setupadded.setup = "Setup Continue";
                _setupadded.PersonID = $("#txtemployeeid").val();
                _setupadded.Machine = $("#drpmachinename").val();

                $.ajax({
                    type: "POST",
                    url: "/Forms/yesresettingstart",
                    data: JSON.stringify(_setupadded),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        updateUIWithData("Setup Start");
                        $("#lblsetupendtimings").hide();
                        $.get("/Forms/getplaaneddata", { machinename: machinename }, function (data) {
                            if (data.length > 0) {
                                $.each(data, function (index, rowbd) {
                                    $("#txtjobno").val(rowbd.JobNum);
                                    $("#txtpartname").val(rowbd.PartNum);
                                    $("#event-rev").val(rowbd.revision);
                                    $("#txtjobqty").val(rowbd.Job_Qty);
                                    $("#txtstdsetuptime").val(rowbd.Setup_time);
                                    $("#txtstdcycletime").val(rowbd.Cycle_Time);
                                    $("#txtokqty").val(rowbd.Ok_Qty);
                                    $("#txtstdsetuptime").val(rowbd.Setup_time);
                                    $("#txtstdcycletime").val(rowbd.Cycle_Time);
                                    $("#txtjobqty").val(rowbd.Job_Qty);
                                    $("#txtcalculatedtime").val(rowbd.Completed_Day);
                                    var JobNum = $("#txtjobno").val();
                                    var status = rowbd.status;
                                    var lbltext = "";

                                    var jobnum = $("#txtjobno").val();
                                    var partnum = $("#txtpartname").val();
                                    var revision = $("#txtrevisionno").val();
                                    var txtloginid = $("#txtemployeeid").val();
                                    var shft = $("#drpshift").val();
                                    var machine = $("#drpmachinename").val();
                                    $.get("/Apps/GetOpno", { JobNum: JobNum }, function (data) {
                                        $("#event-op").empty();
                                        $.each(data, function (index, row) {
                                            $("#event-op").append("<option value='" + row.OprSeq + "'>" + row.OprSeq + "-" + row.ResourceGrpID + "</option>")
                                            $('#event-op').val(rowbd.OP);
                                        });
                                        var Op_No = $('#event-op').val();
                                        $.get("/Forms/getofresettingdetails", { Op_No: Op_No, jobnum: jobnum, machine: machine }, function (data) {
                                            $.each(data, function (i, item) {
                                                var uploaddate = moment(item.uploaddate);
                                                if (status == "Planning") {
                                                    lbltext = "Please Start Setup";
                                                    $("#chkresettingstart").prop("disabled", false);
                                                    $("#chkresettingcontinue").prop("disabled", true);
                                                    $("#chkresettingcomplete").prop("disabled", true);
                                                }
                                                else if (status == "Resetting Start") {
                                                    lbltext = "Resetting is Running";
                                                    $("#chkresettingstart").prop("disabled", true);
                                                    $("#chkresettingcontinue").prop("disabled", false);
                                                    $("#chkresettingcomplete").prop("disabled", true);
                                                    $("#chkresettingstart").prop("checked", true);
                                                }
                                                else if (status == "Resetting Continue") {
                                                    lbltext = "Resetting is Continue for the Next Shift";
                                                    $("#chkresettingstart").prop("disabled", true);
                                                    $("#chkresettingcontinue").prop("disabled", false);
                                                    $("#chkresettingcomplete").prop("disabled", false);
                                                    $("#chkresettingstart").prop("checked", true);
                                                    $("#chkresettingcontinue").prop("checked", true);
                                                }
                                                else if (status == "Resetting End") {
                                                    lbltext = "Resetting is Completed";
                                                    $("#chkresettingstart").prop("disabled", true);
                                                    $("#chkresettingcontinue").prop("disabled", true);
                                                    $("#chkresettingcomplete").prop("disabled", true);
                                                    $("#chkresettingstart").prop("checked", true);
                                                    $("#chkresettingcontinue").prop("checked", true);
                                                    $("#chkresettingstart").prop("checked", true);
                                                    $("#chkresettingcomplete").prop("checked", true);
                                                }
                                                $("#lblmachinestatus").show();
                                                $("#lblmachinestatus").text(lbltext);
                                                $("#lblsetuptimings").show();
                                                //var startTime = moment(uploaddate);
                                                //var interval = 1000;
                                                ////if (timerInterval) {
                                                ////    clearInterval(timerInterval);
                                                ////}
                                                //var timerInterval = setInterval(function () {
                                                //    var currentTime = moment();
                                                //    var elapsedTime = moment.duration(currentTime.diff(startTime));
                                                //    var formattedTime = elapsedTime.hours() + "h " + elapsedTime.minutes() + "m " + elapsedTime.seconds() + "s";
                                                //    $("#lblsetuptimings").show();
                                                //    $("#lblsetuptimings").text(formattedTime);
                                                //}, interval);
                                            });
                                        });
                                    });
                                });
                            } else {

                            }
                        });
                    },
                    error: function (response) {
                        console.log(response);
                    }
                });
            }
        } else {

        }
    });
});
$(document).ready(function () {
    $("#chkresettingcontinue").on("click", function () {
        if ($(this).prop("checked")) {
            if ($(this).is(":checked")) {
                var _setupadded = {};
                _setupadded.JobNum = $("#txtjobno").val();
                _setupadded.PartNum = $("#txtpartname").val();
                _setupadded.RevNo = $("#txtrevisionno").val();
                _setupadded.OP = $("#event-op").val();
                _setupadded.Shift = $("#drpshift").val();
                _setupadded.setup = "Setup Continue";
                _setupadded.PersonID = $("#txtemployeeid").val();
                _setupadded.Machine = $("#drpmachinename").val();
                $("#lblsetupendtimings").hide();
                $.ajax({
                    type: "POST",
                    url: "/Forms/yesresettingcontinue",
                    data: JSON.stringify(_setupadded),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        updateUIWithData("Resetting Continue");
                    },
                    error: function (response) {
                        console.log(response);
                    }
                });
            }
        } else {

        }
    });
});
$(document).ready(function () {
    $("#chkresettingcomplete").on("click", function () {
        if ($(this).prop("checked")) {
            if ($(this).is(":checked")) {
                $("#divforresettingcomplete").show();
                $("#lblsetupendtimings").show();
            }
        } else {
            $("#divforresettingcomplete").hide();
        }
    });
});





