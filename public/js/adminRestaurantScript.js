
//ViewModel for the Restaurant
function RestaurantViewModel() {

	var self = this;
	self.name = ko.observable();
	self.id = ko.observable();
	self.address = ko.observable();
	self.phone = ko.observable(); 
	self.minimumAmount = ko.observable();
	self.waitTime = ko.observable();
	self.startTime = ko.observable();
	self.endTime = ko.observable();
	self.imageUrl = ko.observable();
	self.foodItems = ko.observableArray([]);
	self.selectedRestaurant = ko.observable();
	self.restaurantList = ko.observableArray(["Joe"]);

	self.save = function(){
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
				imageUrl: self.imageUrl,
				foodItems: self.foodItems
			}),
			type: 'post',
			contentType: 'application/json', 
			
			success: function(result){ window.location = "/admin";}
		});
	};

	self.delete = function(){
		var url = baseURL+"/api/restaurant";
		$.ajax(url, { 
			data: ko.toJSON({
				_id: self.id
			}),
			type: 'delete',
			contentType: 'application/json', 
			
			success: function(result){ window.location = "/admin";}
		});
	};

	

}





$(document).ready(function(){

	
	$('#starttime').timepicker();
	$('#endtime').timepicker();

	ko.applyBindings(new RestaurantViewModel());
});



