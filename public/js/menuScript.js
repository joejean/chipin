//Class to represent a menu item
function MenuItem(name, price, foodID){
	var self = this;
	self._id = foodID;
	self.name = name;
	self.price = price;
	self.quantity= ko.observable(0);

	self.totalPrice = ko.computed(function(){
		return self.quantity() * self.price;
	});
}


//ViewModel for the menu page and initial state
function MenuViewModel() {

	var self = this;

	self.menuItems = ko.observableArray([]);

	self.orderedItems = ko.computed(function(){
		return ko.utils.arrayFilter( self.menuItems(), function(menuItem){ return menuItem.quantity() > 0});
	});
	
	self.orderTotal = ko.computed(function(){
		var total = 0;
		for(var i =0; i < self.orderedItems().length ; i++){
			total += self.orderedItems()[i].totalPrice();
		}
		return total;
	});

	self.save = function(){
		//TODO: modify this and add the correct endpoint
		var url = baseURL+"/api/order/"+campaignID+"/"+userID;
		$.ajax(url, { 
			data: ko.toJSON({order: self.orderedItems}),
			type: 'post',
			contentType: 'application/json', 
			//TODO: Modify this to do something more meaningful upon successful post request
			success: function(result){ window.location = "/confirmation";}
		});
	};

	var mappedData = $.map(foodItems, function(item){ return new MenuItem(item.name, item.price, item._id)});
	self.menuItems(mappedData);

	//Load Initial Data to the menuItems
	/*$.getJSON("/campaign", function(data){
		var mappedData = $.map(data, function(item){ return new menuItem(item)});
		self.menuItems(mappedData);
	});*/

}





$(document).ready(function(){

	//ko.applyBindings(new UserViewModel(), document.getElementById("userInfo"));

	ko.applyBindings(new MenuViewModel(), document.getElementById("menu"));
});



