var passport = require('passport');
var express = require('express');
var router = express.Router();
var User = require("../models/user");
var requireAuth = require("../middlewares/requireAuth");
var requireUpdatedProfile = require("../middlewares/requireUpdatedProfile");
var config = require("../config");




router.get("/", function(req, res, next){
  res.render("home.html", {"title":"Home"});
});

router.get("/contact", function(req, res, next){
  res.render("contact.html", {"title":"Contact US"});
});

router.get("/participantHome", requireAuth, requireUpdatedProfile, function(req, res, next){
  res.render("participant_home.html", {"title":"Home"});
});


router.get("/confirmation", requireAuth, requireUpdatedProfile, function(req, res, next){
  res.render("confirmation.html", {"title":"Confirmation"});
});

router.get("/userInfo", function(req, res, next){
  res.render("userinfo.html", {"title":"User Info"});
});

router.get("/menu",requireAuth, requireUpdatedProfile, function(req, res, next){
  res.render("menu.html", {"title":"Menu"});
});



//*** Route Handlers for Login and Logout****//
router.get('/login',function(req, res){

    res.redirect("/auth/google");
  });

router.get('/auth/google',
  passport.authenticate('google',{scope: 'https://www.googleapis.com/auth/userinfo.email',
   hostedDomain:'nyu.edu', approvalPrompt: 'auto'}),
  function(req, res){
    // this function will not be called.   
  });

router.get('/auth/google/callback', 

  passport.authenticate('google', {failureRedirect: '/login'}), requireUpdatedProfile, function(req, res){
      
        var redirectTo = req.session.returnTo || '/';
        delete req.session.returnTo;
        res.redirect(redirectTo);
      
  });


router.get('/logout',function(req, res){
   req.logout();
   res.redirect("/");
  });



module.exports = router;