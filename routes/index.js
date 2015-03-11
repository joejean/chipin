var express = require('express');
var router = express.Router();
var passport = require('passport');

//var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var NYUPassportStrategy = require('passport-nyu').Strategy;



passport.use('nyu-passport',new NYUPassportStrategy({
    clientID: "dorSh6I5oN3Mayb5God8Qu",
    clientSecret: "Oj3Al8yad8Baf3jaf9Ej9A",
    callbackURL: "http://localhost:3000/auth/nyu/callback"
  },
  function(accessToken, refreshToken, profile, done) {

    // User.findOrCreate({ netID: profile.netID }, function (err, user) {
    //   return done(err, user);
    // });
	
	return done(profile.netID);
  }
));

/*passport.use('nyu-passport',new OAuth2Strategy({
    authorizationURL: 'http://passport.sg.nyuad.org/visa/oauth/authorize',
    tokenURL: 'http://passport.sg.nyuad.org/visa/oauth/token',
    clientID: "dorSh6I5oN3Mayb5God8Qu",
    clientSecret: "Oj3Al8yad8Baf3jaf9Ej9A",
    callbackURL: "http://localhost:3000/auth/nyu/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ exampleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
	
    return done(profile);
  }
));*/


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Chipin' });
});
router.get('/test', function(req, res, next) {
  res.send('test');
});

router.get('/auth/nyu',
  passport.authenticate('nyu-passport'));

router.get('/auth/nyu/callback', 
  passport.authenticate('nyu-passport', { successRedirect: '/', failureRedirect: '/login' }));




module.exports = router;
