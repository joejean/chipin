$(document).ready(function(){

	
	countDown(endTime);

	function countDown (theEndTime){

		var theCurrentTime = new Date();

		var millisecondsLeft = theEndTime.getTime() - theCurrentTime.getTime();
		var theRemainingTime = new Date(millisecondsLeft);

		var daysLeft = theEndTime.getDay() - theCurrentTime.getDay();
		
		var hoursLeft = theEndTime.getHours()-theCurrentTime.getHours();
		
		var minutesLeft = theEndTime.getMinutes()- theCurrentTime.getMinutes();
		
		var secondsLeft = theEndTime.getSeconds()- theCurrentTime.getSeconds();
	
			timer_dom =  document.getElementById("jumbo");

			timer_day = document.getElementById("timer_day");
			timer_day.innerHTML = daysLeft + "<strong> d</strong>";

			timer_hour = document.getElementById("timer_hour");
			timer_hour.innerHTML = hoursLeft + "<strong> h</strong>";

			timer_minute = document.getElementById("timer_minute");
			timer_minute.innerHTML = minutesLeft + "<strong> m</strong>";

			
			timerID = setInterval(function(){

								theCurrentTime = new Date();
								daysLeft = theEndTime.getDay() - theCurrentTime.getDay();

								hoursLeft = theEndTime.getHours()-theCurrentTime.getHours();
								minutesLeft = theEndTime.getMinutes()- theCurrentTime.getMinutes();
								secondsLeft = theEndTime.getSeconds()- theCurrentTime.getSeconds();
								if (secondsLeft<0)
								{
									secondsLeft+=60;
									minutesLeft-=1;
								}

								if (minutesLeft<0)
								{
									minutesLeft+=60;
									hoursLeft-=1;
								}

								if (hoursLeft<0)
								{
									hoursLeft+=24;
									daysLeft-=1;
								}

								if (daysLeft<=0&&hoursLeft<=0&&minutesLeft<=0&&secondsLeft<=0)
									onCampaignFinish();


								timer_day.innerHTML = daysLeft + "<strong> d</strong>";
								timer_hour.innerHTML = hoursLeft + "<strong> h</strong>";
								timer_minute.innerHTML = minutesLeft + "<strong> m</strong>";
								
						},1000);
			
			var onCampaignFinish= function (){
												minutesLeft =0;
												clearInterval(timerID);
												alert("times up!");
												timer_hour.innerHTML = " ";
												timer_minute.innerHTML = " ";
												timer_dom.innerHTML = "<h1><strong> Campaign Ended! <strong></h1>";

			}
		}
						
});
