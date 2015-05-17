

$(document).ready(function(){



// setInterval(function(){
// 	$("a[id^='time']").each(function(){
// 		var id = $(this).attr("id");
// 		var res = id.match(/time-(.*)/);
// 		// console.log(countdown( new Date(res[1]) ).toString());


// 	});
// },1000);

$("div[id^='countdown']").each(function(){

	var id = $(this).attr("id");
	var res = id.match(/countdown-(.*)/);
	var ele = $(this);
	$(this).bind(setInterval(function(){
		ele.text(countdown( new Date(res[1]) ).toString());
	},1000));
});





});