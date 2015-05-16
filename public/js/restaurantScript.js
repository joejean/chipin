

$(document).ready(function(){


$("input[id^='selectTime']").each(function(){
	var minTime = this.getAttribute("minTime");
	var maxTime = this.getAttribute("maxTime");
	$(this).timepicker({
	'minTime': minTime,
    'maxTime': maxTime});
	var res = $(this).attr("id").match(/selectTime([a-zA-Z0-9_]*)/);
	var id = res[1];

    $("#selectDate"+id).datepicker({
        'format': 'yyyy-m-d',
        'autoclose': true
    });


});

$("input[id^='selectDate']").change(function(){

	var dateVal = new Date($(this).val());
	dateVal.setHours(0,0,0,0);
	var dateNow = new Date();
	dateNow.setHours(0,0,0,0);
	if (dateVal < dateNow){
		$(this).val("");
	}
});

$("input[id^='submit']").click(function(){
	var res = $(this).attr("id").match(/submit([a-zA-Z0-9_]*)/);
	var id = res[1];

	//get date and time input
	var valDate = $("#selectDate"+id).val();
	var valTime = $("#selectTime"+id).val();


	if ((!valDate) || (!valTime)){
		return;
	}

	console.log(valDate);
	console.log(valTime);

	console.log(res);
	var url = baseURL+"/api/campaign/";
	console.log(url);
	var newDate = new Date();
	console.log(newDate.getTime());
	$.ajax(url, { 
		data: JSON.stringify({restaurantID: res[1], rawDate: valDate, rawTime : valTime}),
		type: 'POST',
		contentType: 'application/json', 
		dataType: "json",
		//TODO: Modify this to do something more meaningful upon successful post request
		success: function(result){ 
			console.log(result);
			// window.location = "/confirmation";
		}
	});
});




});