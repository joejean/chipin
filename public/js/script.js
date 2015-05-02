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

}



$(document).ready(function(){

	ko.applyBindings(new MenuViewModel(), document.getElementById("menu"));
});



