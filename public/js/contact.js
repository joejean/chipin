
//ViewModel for the contact page
function ContactViewModel() {

	var self = this;
	self.name = ko.observable();
	self.email = ko.observable();
	self.phone = ko.observable();
	self.message = ko.observable();
		
	//Operations
	self.send = function(){
		
		var url = baseURL+"/contact";
		$.ajax(url, { 
			data: ko.toJSON({
				name: self.name,
				email: self.email,
				phone: self.phone,
				message: self.message
			}),
			type: 'post',
			contentType: 'application/json', 
			
			success: function(result){ window.location = "/";}
		});
	};
	
}



$(document).ready(function(){

	ko.applyBindings(new ContactViewModel());
});



