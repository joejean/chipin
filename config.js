
var config = {};
config.db = {};
config.session = {};
config.google = {};

/*Check If app is running in production or development*/
if(process.env.NODE_ENV ==="production"){

	config.baseURL = "http://www.chipin.ae";
	config.db.uri = process.env.MONGOLAB_URI;

}
else{

	config.baseURL = "http://localhost:3000";
	config.db.uri = "mongodb://localhost/chipin";
}



/* Google Oauth & Session*/
config.session.secret = "\xc9\xe7\xfb\xf2\xe9~o\xa1\xe0\xd9\x15\t\xacNe\xe0bI0a6\xd7";
config.google.clientID = "891538322317-63tvts0nv9q8ugllikm353emhn9n8cav.apps.googleusercontent.com";
config.google.clientSecret = "obTzQm81YJhVmzpKHH3tjEzZ";


module.exports = config;
