var passport = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
//var NYUPassportStrategy = require('passport-nyu').Strategy;
var express = require('express');
var router = express.Router();
var User = require("../models/user");
var config = require("../config");

//Passport Strategy Configuration
passport.use(new OAuth2Strategy({
    authorizationURL: config.oauth.authorizationURL,
    tokenURL: config.oauth.tokenURL,
    clientID: config.oauth.clientID,
    clientSecret: config.oauth.clientSecret,
    callbackURL: "http://127.0.0.1:3000/login/callback",
    scope:['netID', 'school', 'class', "name"],
    profileFields: ['netID', 'school', 'class', "name"]
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ netID: profile.netID },
      function (err, user) {
      if(err){
        return done(err);
      }
      if(!user){
        user = new User({netID: profile.netID, name: profile.name});
        user.save(function(err){
          if(err) console.log(err);
          return done(err,user);
        });
      }
      else{
        return done(err, user);
      }
      
    });
  }
));



router.get("/", function(req, res, next){
  res.render("index.html");
});

router.get('/loginSuccess',function(req, res){

    res.send("Logged Successfuly");
  });

router.get('/login',
  passport.authenticate('oauth2', {scope:['netID', 'school', 'class', 'name'] }),
  function(req, res){
    // this function will not be called.
  });

router.get('/logout',function(req, res){
   req.logout();
   res.redirect("http://passport.sg.nyuad.org/auth/logout");
  });


router.get('/login/callback', 

  passport.authenticate('oauth2', { failureRedirect: '/login' }),
  function(req, res) {

    //Successful authentication, redirect home.
    res.redirect("/loginSuccess");
  });




module.exports = router;