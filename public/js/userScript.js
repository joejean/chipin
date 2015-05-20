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
	self.buildingNo = ko.observableArray(["A2A","A2B","A2C","A5A","A5B","A5C","A6A","A6B","A6C","B1","C2","C1","B2"]);
	self.selectedBuildingNo = ko.observable();
	self.roomNo = ko.observable();

	self.save = function(){
		
		$.ajax(baseURL+"/api/user", {
			data: ko.toJSON({_id: self.userID, email: self.email, name: self.name,
			 phone: self.phone, buildingNo: self.selectedBuildingNo, roomNo: self.roomNo}),
			type: "post", 
			contentType: "application/json",
			
			success: function(result){ window.location = "/";}

		});
	};

	$.getJSON(baseURL+"/api/user/"+user_id, function(user){
			data = user[0];
			self.userID(data._id);
			self.email(data.email);
			self.name(data.name);
			self.phone(data.phone);
			self.selectedBuildingNo(data.buildingNo);
			self.roomNo(data.roomNo);

	});
	

}




$(document).ready(function(){

	ko.applyBindings(new UserViewModel(), document.getElementById("userInfo"));

});



