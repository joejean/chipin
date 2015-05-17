//Class to represent a menu item
function MenuItem(name, price){
	var self = this;
	self.name = ko.observable(name);
	self.price = ko.observable(price);
}


//ViewModel for the menu page and initial state
function MenuViewModel() {

	var self = this;
	self.restaurantList = ko.observableArray([]);
	self.selectedRestaurant = ko.observable();
	self.menuItems = ko.observableArray([
		new MenuItem("Test0", 56)
		]);

	//Operation
	self.save = function(){
		
		var url = baseURL+"/api/order/"+campaignID+"/"+userID;
		$.ajax(url, { 
			data: ko.toJSON({order: self.orderedItems}),
			type: 'post',
			contentType: 'application/json', 
			
			success: function(result){ window.location = "/confirmation";}
		});
	}
	self.addMenuItem = function(){
		self.menuItems.push(new MenuItem(" ", 0));
	}

	self.removeMenuItem = function(menuItem){
		self.menuItems.remove(menuItem);
	}
	/*var mappedData = $.map(foodItems, function(item){ return new MenuItem(item.name, item.price, item._id)});
	self.menuItems(mappedData);*/

	//Load Initial Data to the menuItems
	/*$.getJSON("/campaign", function(data){
		var mappedData = $.map(data, function(item){ return new menuItem(item)});
		self.menuItems(mappedData);
	});*/

}





$(document).ready(function(){

	

	ko.applyBindings(new MenuViewModel());
});



