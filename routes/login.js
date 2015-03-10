passport = require('passport-oauth');
var express = require('express');
var router = express.Router();


passport.use(new OAuth2Strategy({
    authorizationURL: 'http://passport.sg.nyuad.org/visa/oauth/authorize',
    tokenURL: 'http://passport.sg.nyuad.org/visa/oauth/token',
    clientID: "dorSh6I5oN3Mayb5God8Qu",
    clientSecret: "Oj3Al8yad8Baf3jaf9Ej9A",
    callbackURL: "http://localhost:3000/auth/nyu/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ exampleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));




routher.get('/auth/nyu',
  passport.authenticate('oauth2'));

router.get('/auth/nyu/callback',
  passport.authenticate('oauth2', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Chipin' });
});

module.exports = router;