var passport = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
//var NYUPassportStrategy = require('passport-nyu').Strategy;
var express = require('express');
var router = express.Router();
var User = require("../models/user");
var config = require("../config");



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