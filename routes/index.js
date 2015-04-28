var passport = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
//var NYUPassportStrategy = require('passport-nyu').Strategy;
var express = require('express');
var router = express.Router();
var User = require("../models/user");
var config = require("../config");



router.get("/", function(req, res, next){
  res.render("home.html", {"title":"Home"});
});

router.get("/participantHome", function(req, res, next){
  res.render("participant_home.html", {"title":"Home"});
});


router.get("/confirmation", function(req, res, next){
  res.render("confirmation.html", {"title":"Confirmation"});
});

router.get("/signup", function(req, res, next){
  res.render("signup.html", {"title":"Signup"});
});

router.get("/menu", function(req, res, next){
  res.render("menu.html", {"title":"Menu"});
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