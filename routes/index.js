var passport = require('passport');
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

router.get('/auth/google',
  passport.authenticate('google',{scope: 'https://www.googleapis.com/auth/userinfo.email', hostedDomain:'nyu.edu'}),
  function(req, res){
    // this function will not be called.   
  });

router.get('/auth/google/callback', 

  passport.authenticate('google', {successRedirect:'/loginSuccess', failureRedirect: '/login'})
  );


router.get('/logout',function(req, res){
   req.logout();
   res.redirect("/");
  });






module.exports = router;