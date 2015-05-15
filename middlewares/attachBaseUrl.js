/*This middlewara attach the current base URL to all the views*/

var config = require("../config");
function attachBaseUrl(req, res, next){

	res.locals.baseURL = config.baseURL;
	next()

}

module.exports = attachBaseUrl;