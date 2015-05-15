var config = require("../config");
var Admin = require("../models/admin");

/* This middleware only allows admin to access the pages on which it is applied*/
function requireAdmin (req, res, next){

	if (!req.isAuthenticated()){

		req.session.returnTo = req.path; 
		res.redirect("/login");
	}

	else{
		/* Once they are authenticated as normal user, we check if they are admin*/
		Admin.findOne({email: req.user.email},
	      function (err, user) {
	      if(err){
	        return console.log(err);
	      }
	      else if(!user){
	      	res.redirect("/");
	      }
	      else{
	        next();
	      }
	      
	    });		
	}
}


module.exports = requireAdmin;