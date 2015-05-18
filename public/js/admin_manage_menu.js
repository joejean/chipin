//Class to represent a menu item
function MenuItem(name, price){
	var self = this;
	self.name = ko.observable(name);
	self.price = ko.observable(price);
}

function Restaurant(id, name){
	var self = this;
	self.id = id;
	self.name = name;
}



//ViewModel for the menu page and initial state
function MenuViewModel() {

	var self = this;
	self.restaurantList = ko.observableArray([]);
	self.selectedRestaurant = ko.observable();
	self.menuItems = ko.observableArray([
		new MenuItem("",0)
	]);

	//Operation
	self.save = function(){
		
		var url = baseURL+"/api/restaurantByID/"+self.selectedRestaurant().id;
		$.ajax(url, { 
			data: ko.toJSON(self.menuItems),
			type: 'put',
			contentType: 'application/json', 
			
			success: function(result){ window.location = "/admin";}
		});
	}
	self.addMenuItem = function(){
		self.menuItems.push(new MenuItem(" ", 0));
	}

	self.removeMenuItem = function(menuItem){
		self.menuItems.remove(menuItem);
	}
	
	//Load Initial Data to the menuItems
	$.getJSON(baseURL+"/api/restaurant", function(data){
		var mappedData = $.map(data, function(item){ return new Restaurant(item._id, item.name)});
		self.restaurantList(mappedData);
	});
}



$(document).ready(function(){

	ko.applyBindings(new MenuViewModel());
});



