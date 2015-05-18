$(document).ready(function(){

	$("div[id^='countdown']").each(function(){

		var id = $(this).attr("id");
		var res = id.match(/countdown-(.*)/);
		var ele = $(this);
		$(this).bind(setInterval(function(){
			ele.text(countdown( new Date(res[1]) ).toString());
		},1000));
	});

});