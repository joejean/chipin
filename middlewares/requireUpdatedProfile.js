function requireUpdatedProfile(req, res, next){
//After the user is authenticated we check to see if we already have his phone
//number and delivery address information. If not we force them to update their profile
//by redirecting them to the userInfo.html
	if (req.isAuthenticated()){
		console.log(req.user.phone);
		if(!req.user.phone && !req.user.buildingNo)
        	res.redirect("/userInfo");
      	else
      		next();
	
	}

	else{
		next();
	}
}


module.exports = requireUpdatedProfile;