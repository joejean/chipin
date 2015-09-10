var nodemailer = require('nodemailer');
var config = {};
config.db = {};
config.session = {};
config.google = {};

/*Check If app is running in production or development*/
if(process.env.NODE_ENV ==="production"){

	config.baseURL = "http://www.chipin.ae";
	config.db.uri = process.env.MONGOLAB_URI;
	config.email = process.env.email;
	config.password = process.env.password;
	/* Google Oauth & Session*/
	config.session.secret = process.env.SESSIONSECRET;
	config.google.clientID = process.env.GOOGLE_CLIENT_ID;
	config.google.clientSecret = process.env.GOOGLE_CLIENT_SECRET;

}
else{

	config.baseURL = "http://localhost:3000";
	config.db.uri = "mongodb://localhost/chipin";
	config.email = "chipinae@gmail.com";
	config.password = "chipinae12345";
	/* Google Oauth & Session*/
	config.session.secret = "\x06\xe9\xc2\xefE\xbc3#\x9d)m\x9eX\xe8\xa1\xb2\xb5N\\y";
	config.google.clientID = "807422291056-dbev3t9upuc18h0s7nkebree18jcp5o1.apps.googleusercontent.com";
	config.google.clientSecret = "ZEoPMsozoKtfFDvbEZIj0cxt";
}

/*Config for Email*/
config.transporter = nodemailer.createTransport({
	service:'Gmail',
	auth:{
		user: config.email,
		pass: config.password
	}
});


module.exports = config;
