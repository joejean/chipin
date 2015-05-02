function requireAuth (req, res, next){

	if (!req.isAuthenticated()){

		req.session.returnTo = req.path; 
		res.redirect("/login");
	}
	else{

		next();
	}
}


module.exports = requireAuth;