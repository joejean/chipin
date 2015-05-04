//Class to represent a menu item
function MenuItem(name, price){
	var self = this;
	self.name = name;
	self.price = price;
	self.quantity= ko.observable(0);

	self.totalPrice = ko.computed(function(){
		return self.quantity() * self.price;
	});
}



//Class to represent a User Object
function User(userID, netID, name) {

	var self = this;
	self.userID = ko.observable(userID);
	self.netID = ko.observable(netID);
	self.name = ko.observable(name);
	self.phone = ko.observable('');
	self.buildingNo = ko.observable('');
	self.roomNo = ko.observable('');

}

//ViewModel for the user information page 
function UserViewModel(){
	var self = this;
	self.user = ko.observable();

	self.save = function(){
		//TODO: modify this and add the correct endpoint
		$.ajax("/user", {
			data: ko.toJSON({user: self.user}),
			type: "post", 
			contentType: "application/json",
			//TODO: Modify this to redirect the user to home on a successful submission
			success: function(result){ alert(result)}

		});
	};

}

//ViewModel for the menu page and initial state
function MenuViewModel() {

	var self = this;
	self.menuItems = ko.observableArray([
		new MenuItem("Test", 34),
		new MenuItem("Test2", 45),
		new MenuItem("Test3", 54)
	]);

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
		$.ajax("/orders", { 

			data: ko.toJSON({order: self.orderedItems}),
			type: 'post',
			contentType: 'application/json', 
			//TODO: Modify this to do something more meaningful upon successful post request
			success: function(result){ alert(result)}
		});
	};
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



