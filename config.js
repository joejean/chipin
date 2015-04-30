
var config = {};
config.oauth = {};
config.db = {};
config.session = {};

/*Database*/
config.db.uri = "mongodb://localhost/chipin";


/*Oauth */
config.oauth.clientSecret = "Oj3Al8yad8Baf3jaf9Ej9A";
config.oauth.clientID = "dorSh6I5oN3Mayb5God8Qu";
config.oauth.authorizationURL = 'http://passport.sg.nyuad.org/visa/oauth/authorize';
config.oauth.tokenURL = 'http://passport.sg.nyuad.org/visa/oauth/token';
config.session.secret = "\xc9\xe7\xfb\xf2\xe9~o\xa1\xe0\xd9\x15\t\xacNe\xe0bI0a6\xd7";


module.exports = config;
