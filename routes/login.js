var passport = require('passport');
//var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var NYUPassportStrategy = require('passport-nyu').Strategy;
var express = require('express');
var router = express.Router();


passport.use(new NYUPassportStrategy({
    clientID: "dorSh6I5oN3Mayb5God8Qu",
    clientSecret: "Oj3Al8yad8Baf3jaf9Ej9A",
    callbackURL: "http://127.0.0.1:3000/auth/nyu/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ netID: profile.netID }, function (err, user) {
      return done(err, user);
    });
  }
));

/*router.get('/auth/nyu',
  passport.authenticate('nyu-passport'),
  function(req, res){
    // The request will be redirected to AngelList for authentication, so
    // this function will not be called.
  });

router.get('/auth/nyu/callback', 
  passport.authenticate('nyu-passport', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
*/
// passport.use(new OAuth2Strategy({
//     authorizationURL: 'http://passport.sg.nyuad.org/visa/oauth/authorize',
//     tokenURL: 'http://passport.sg.nyuad.org/visa/oauth/token',
//     clientID: "dorSh6I5oN3Mayb5God8Qu",
//     clientSecret: "Oj3Al8yad8Baf3jaf9Ej9A",
//     callbackURL: "http://localhost:3000/auth/nyu/callback"
//   },
//   function(accessToken, refreshToken, profile, done) {
//     // User.findOrCreate({ exampleId: profile.id }, function (err, user) {
//     //   return done(err, user);
//     // });
//     return done(err, user);
//   }
// ));



module.exports = router;