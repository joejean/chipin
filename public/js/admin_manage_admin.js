//Class to represent a menu item
function Admin(name, email){
	var self = this;
	self.name = ko.observable(name);
	self.email = ko.observable(email);
}


//ViewModel for the menu page and initial state
function AdminViewModel() {

	var self = this;
	self.newAdmins = ko.observableArray([
		new Admin(" "," ")
	]);

	self.currentAdmins = ko.observableArray([]);
		
	//Operations
	self.save = function(){
		
		var url = baseURL+"/api/admin/";
		$.ajax(url, { 
			data: ko.toJSON({admins: self.newAdmins}),
			type: 'post',
			contentType: 'application/json', 
			
			success: function(result){ window.location = "/admin";}
		});
	}
	self.addAdmin = function(){
		self.newAdmins.push(new Admin(" ", " "));
	}

	self.removeAdmin = function(admin){
		self.newAdmins.remove(admin);
	}
	
	//Load Initial Data to the menuItems
	$.getJSON(baseURL+"/api/admin", function(data){
		var mappedData = $.map(data, function(item){ return new Admin(item.name, item.email)});
		self.currentAdmins(mappedData);
	});
}



$(document).ready(function(){

	ko.applyBindings(new AdminViewModel());
});



