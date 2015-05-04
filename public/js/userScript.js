//Class to represent a User Object
function User() {

	var self = this;
	self.userID = ko.observable();
	self.email = ko.observable();
	self.name = ko.observable();
	self.phone = ko.observable();
	self.buildingNo = ko.observable();
	self.roomNo = ko.observable();

}

//ViewModel for the user information page 
function UserViewModel(){
	var self = this;
	self.userID = ko.observable(userID);
	self.email = ko.observable(userEmail);
	self.name = ko.observable(userName);
	self.phone = ko.observable();
	self.buildingNo = ko.observableArray(["A2A","A2B","A2C","A5A","A5B","A5C","A6A","A6B","A6C"]);
	self.selectedBuildingNo = ko.observable();
	self.roomNo = ko.observable();

	self.save = function(){
		//TODO: modify this and add the correct endpoint
		console.log(self.selectedBuildingNo());
		console.log(self.name());
		console.log(self.email());
		console.log(self.phone());
		$.ajax("http://localhost:3000/api/user", {
			data: ko.toJSON({_id: self.userID, email: self.email, name: self.name,
			 phone: self.phone, buildingNo: self.selectedBuildingNo, roomNo: self.roomNo}),
			type: "post", 
			contentType: "application/json",
			//TODO: Modify this to redirect the user to home on a successful submission
			success: function(result){ window.location = "/";}

		});
	};

}




$(document).ready(function(){

	ko.applyBindings(new UserViewModel(), document.getElementById("userInfo"));

});



