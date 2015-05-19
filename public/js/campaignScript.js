$(document).ready(function(){

	$("div[id^='countdown']").each(function(){

		var id = $(this).attr("id");
		var res = id.match(/countdown-(.*)/);
		var ele = $(this);
		$(this).bind(setInterval(function(){
			var timeEnd = new Date(res[1]);
			if (timeEnd < new Date()){
				ele.parents('#jumbo').hide();
				$(this).click(function(e){
					e.preventDefault();
				});
			}
			else{
				ele.text(countdown( timeEnd ).toString()+" left..");
			}
		},1000));
	});

});