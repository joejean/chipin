var passport = require('passport');
var express = require('express');
var router = express.Router();
var User = require("../models/user");
var requireAuth = require("../middlewares/requireAuth");
var requireUpdatedProfile = require("../middlewares/requireUpdatedProfile");
var config = require("../config");
var async = require('async');
var request = require('request');






router.get("/", function(req, res, next){
  var campaign;
  var restaurant;
  async.waterfall([

    function(callback){
      var url = "http://localhost:3000/api/campaign";
      console.log("calling campaign");
      request(url, function(err, response, body) {
        // JSON body
        //if(err) { console.log(err);callback(true); return; }
        campaign = JSON.parse(body)[0];
        callback(null, campaign.restaurant);
        
      });
      
    },
    function(restaurant, callback){
      console.log(restaurant);
      var url = "http://localhost:3000/api/restaurantByID/"+restaurant;
      console.log("calling restaurant");
      request(url, function(err, response, body) {
        // JSON body
        if(err) { console.log(err); callback(true); return; }
        restaurant = JSON.parse(body);
        console.log("logging Restaurant"+ restaurant.name);
        callback(null, restaurant);
      });
      
       
    }
  ],
  function (err, result) {
    //console.log(result);
   if(err) { console.log(err); res.send(500,"Server Error"); return; }

   res.render("home.html", {"title":"Home", "campaign": campaign, "restaurant": result});   
  });

  
});

router.get("/contact", function(req, res, next){
  res.render("contact.html", {"title":"Contact US"});
});

router.get("/participantHome", requireAuth, requireUpdatedProfile, function(req, res, next){
  res.render("participant_home.html", {"title":"Home"});
});


router.get("/confirmation", requireAuth, requireUpdatedProfile, function(req, res, next){

   var url = "http://localhost:3000/api/campaign"
      request(url, function(err, response, body) {
        // JSON body
        if(err) { console.log(err); callback(true); return; }
        var campaign = JSON.parse(body)[0];
        res.render("confirmation.html", {"title":"Confirmation", "campaign": campaign});
      });
});

router.get("/userInfo",requireAuth, function(req, res, next){
  res.render("userinfo.html", {"title":"User Info"});
});

router.get("/menu/:restaurantID",requireAuth, requireUpdatedProfile, function(req, res, next){
  var restaurantID = req.params.restaurantID;
 
 /* var url = "http://localhost:3000/api/restaurantByID/"+restaurantID;
      request(url, function(err, response, body) {
        // JSON body
        if(err) { console.log(err); callback(true); return; }
        var restaurant = JSON.parse(body);
        res.render("menu.html", {"title":"Menu", "restaurant": restaurant});
      });
  */

  var campaign;
  var restaurant;
  async.waterfall([

    function(callback){
      var url = "http://localhost:3000/api/campaign";
      console.log("calling campaign");
      request(url, function(err, response, body) {
        // JSON body
        //if(err) { console.log(err);callback(true); return; }
        campaign = JSON.parse(body)[0];
        callback(null, campaign.restaurant);
        
      });
      
    },
    function(restaurant, callback){
      console.log(restaurant);
      var url = "http://localhost:3000/api/restaurantByID/"+restaurantID;
      console.log("calling restaurant");
      request(url, function(err, response, body) {
        // JSON body
        if(err) { console.log(err); callback(true); return; }
        restaurant = JSON.parse(body);
        console.log("logging Restaurant"+ restaurant.name);
        callback(null, restaurant);
      });
      
       
    }
  ],
  function (err, result) {
    //console.log(result);
   if(err) { console.log(err); res.send(500,"Server Error"); return; }

   res.render("menu.html", {"title":"Menu", "campaign": campaign, "restaurant": result});   
  });


  
});



//*** Route Handlers for Login and Logout****//
router.get('/login',function(req, res){

    res.redirect("/auth/google");
  });

router.get('/auth/google',
  passport.authenticate('google',{scope:['email', 'profile'],
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