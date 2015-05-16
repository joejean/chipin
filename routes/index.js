var passport = require('passport');
var express = require('express');
var router = express.Router();
var User = require("../models/user");
var requireAuth = require("../middlewares/requireAuth");
var requireUpdatedProfile = require("../middlewares/requireUpdatedProfile");
var config = require("../config");
var async = require('async');
var request = require('request');
var formatTime = require('../lib/formatTime');
// time-related helper




router.get("/", function(req, res, next){
  var campaign;
  var restaurant;
  async.waterfall([
    function(callback){
      var url = config.baseURL+"/api/campaign";
      request(url, function(err, response, body) {
        // JSON body
        //if(err) { console.log(err);callback(true); return; }
        campaign = JSON.parse(body)[0];
        callback(null, campaign.restaurant);
        
      });
      
    },
    function(restaurant, callback){
      var url = config.baseURL+"/api/restaurantByID/"+restaurant;
      request(url, function(err, response, body) {
        // JSON body
        if(err) { console.log(err); callback(true); return; }
        restaurant = JSON.parse(body);
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

   var url = config.baseURL+"/api/campaign"
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
 
  var campaign;
  var restaurant;
  async.waterfall([

    function(callback){
      var url = config.baseURL+"/api/campaign";
      request(url, function(err, response, body) {
        // JSON body
        //if(err) { console.log(err);callback(true); return; }
        campaign = JSON.parse(body)[0];
        callback(null, campaign.restaurant);
        
      });
      
    },
    function(restaurant, callback){
      var url = config.baseURL+"/api/restaurantByID/"+restaurantID;
      request(url, function(err, response, body) {
        // JSON body
        if(err) { console.log(err); callback(true); return; }
        restaurant = JSON.parse(body);
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

    // res.redirect("/auth/google");
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

router.get('/restaurant', function(req,res){
  
  var url = config.baseURL+"/api/allRestaurant";
  console.log("calling restaurant");
  request(url, function(err, response, body) {
    // JSON body
    if(err) { console.log(err); return; }
    var restaurantList = JSON.parse(body);
    var timeNow = new Date();

    var i;

    // manipulate the allowed duration to chipin
    // JOE - i'm trying to use this timepicker library http://jonthornton.github.io/jquery-timepicker/
    // 
    for( i =0 ; i< restaurantList.length; i++){

      // time deliver here is the earliest one person could get an order
      // eg. he orders a lot that his deal gets automatically activated
      var timeDeliver = new Date( timeNow.getTime() +restaurantList[i].waitTime*60*1000 );
      timeDeliver =  formatTime.ceilingFifteen(timeDeliver);

      var nowTime = formatTime.formatAMPM(timeNow);
      var minTime = formatTime.formatAMPM(timeDeliver);
      var maxTime = restaurantList[i].endTime;

      if (formatTime.getTimeMinute(nowTime) < formatTime.getTimeMinute(restaurantList[i].startTime)){
        // console.log(restaurantList[i].name);
        // console.log("time now:"+getTimeMinute(nowTime));
        // console.log("time resstart:" + getTimeMinute(restaurantList[i].startTime));
        restaurantList[i]["minTime"] = "";
        restaurantList[i]["maxTime"] = ""; 
      }
      else{
        restaurantList[i]["minTime"] = minTime;
        restaurantList[i]["maxTime"] = maxTime;
      }


    };

    res.render("restaurant.html", {"title":"Restaurants", "restaurants":restaurantList});

  });


});


module.exports = router;