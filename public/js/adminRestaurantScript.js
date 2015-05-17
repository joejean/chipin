
//ViewModel for the Restaurant
function RestaurantViewModel() {

	var self = this;
	self.name = ko.observable();
	self.address = ko.observable();
	self.phone = ko.observable(); 
	self.minimumAmount = ko.observable();
	self.waitTime = ko.observable();
	self.startTime = ko.observable();
	self.endTime = ko.observable();
	self.foodItems = ko.observableArray([]);

	self.save = function(){
		console.log(self.startTime());
		var url = baseURL+"/api/restaurant";
		$.ajax(url, { 
			data: ko.toJSON({
				name: self.name,
				address: self.address,
				phone: self.phone,
				minimumAmount: self.minimumAmount,
				waitTime: self.waitTime,
				startTime: self.startTime,
				endTime: self.endTime,
				foodItems: self.foodItems
			}),
			type: 'post',
			contentType: 'application/json', 
			
			success: function(result){ window.location = "/admin";}
		});
	};

	

}





$(document).ready(function(){

	
	$('#starttime').timepicker();
	$('#endtime').timepicker();

	ko.applyBindings(new RestaurantViewModel(), document.getElementById("restaurantForm"));
});



