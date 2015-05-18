var passport = require('passport');
var express = require('express');
var router = express.Router();
var User = require("../models/user");
var requireAuth = require("../middlewares/requireAuth");
var requireUpdatedProfile = require("../middlewares/requireUpdatedProfile");
var requireAdmin = require("../middlewares/requireAdmin");
var config = require("../config");
var async = require('async');
var request = require('request');
var formatTime = require('../lib/formatTime');
// time-related helper



/*User Interface Routes*/
router.get("/", function(req, res, next){
  var campaign;
  var restaurant;
  async.waterfall([
    function(callback){
      var url = config.baseURL+"/api/campaign";
      request(url, function(err, response, body) {
        // JSON body
        if(err) { console.log(err);callback(true); return; }
        campaign = JSON.parse(body)[0];
        callback(null, campaign.restaurant._id);
        
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
   if(err) { console.log(err); res.send(500,"Server Error"); return; }

   res.render("home.html", {"title":"Home", "campaign": campaign, "restaurant": result});   
  });

});

router.route("/contact")
.get(function(req, res, next){
  res.render("contact.html", {"title":"Contact US"});
})
.post(function(req, res, next){
  data = req.body;

  config.transporter.sendMail({
            from: data.email,
            to: config.email,
            subject: 'Chipin.ae | Email from '+data.name,
            html: '<b>Phone Number:</b> '+data.phone+'<br><b>Email:</b> '+data.email+
            '<br><b>Message:</b> '+data.message
  }, function(err,info){

    if (err){ console.log(err);}
    
  });

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


// to replace menu by restaurant
router.get("/menuByCampaign/:campaignID",requireAuth, requireUpdatedProfile, function(req, res, next){

  var url = config.baseURL+"/api/campaignByID/"+req.params.campaignID;
  request(url, function(err, response, body) {
        // JSON body
    if(err) { console.log(err); res.send(500,"Server Error"); return; }
    campaign = JSON.parse(body)[0];
    res.render("menu.html", {"title":"Menu", "campaign": campaign, "restaurant": campaign.restaurant});   
        
  });
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
        if(err) { console.log(err);callback(true); return; }
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

router.get('/campaign', function(req,res){


  var url = config.baseURL+"/api/campaign";
  console.log("calling all active campaigns");
  request(url, function(err, response, body) {
    // JSON body
    if(err) { console.log(err); return; }
    var campaignList = JSON.parse(body);


    res.render("campaign.html", {"title":"Campaign", "campaigns":campaignList});

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


/*Admin Interface Routes*/
router.get('/admin',requireAdmin, function(req,res){

  res.render("admin.html", {"title":"Admin Home"})
});

router.get('/admin/campaign',requireAdmin, function(req,res){
  
  var url = config.baseURL+"/api/allRestaurant";
  console.log("calling restaurant");
  request(url, function(err, response, body) {
    // JSON body
    if(err) { console.log(err); return; }
    var restaurantList = JSON.parse(body);
    var timeNow = new Date();

    var i;

    // manipulate the allowed duration to chipin
    // using the timepicker library http://jonthornton.github.io/jquery-timepicker/
    for( i =0 ; i< restaurantList.length; i++){

      // time deliver here is the earliest one person could get an order
      // eg. he orders a lot that his deal gets automatically activated
      var timeDeliver = new Date( timeNow.getTime() +restaurantList[i].waitTime*60*1000 );
      timeDeliver =  formatTime.ceilingFifteen(timeDeliver);

      var nowTime = formatTime.formatAMPM(timeNow);
      var minTime = formatTime.formatAMPM(timeDeliver);
      var maxTime = restaurantList[i].endTime;
      console.log(restaurantList[i].name);
      console.log(formatTime.getTimeMinute(nowTime));
      console.log(formatTime.getTimeMinute(restaurantList[i].startTime));

      var minuteNow = formatTime.getTimeMinute(nowTime);
      var minuteStart = formatTime.getTimeMinute(restaurantList[i].startTime);
      var minuteEnd = formatTime.getTimeMinute(restaurantList[i].endTime);
      if (minuteNow > minuteEnd){
       
        restaurantList[i]["minTime"] = "";
        restaurantList[i]["maxTime"] = ""; 
      }
      else if ( minuteNow < minuteStart){
        restaurantList[i]["minTime"] = restaurantList[i].startTime;
        restaurantList[i]["maxTime"] = maxTime;

      }      
      else{
        restaurantList[i]["minTime"] = minTime;
        restaurantList[i]["maxTime"] = maxTime;
      }


    };

    res.render("admin_manage_campaign.html", {"title":"Manage Campaign", "restaurants":restaurantList});

  });


});

router.get('/order', requireAuth, function(req,res){

  var url = config.baseURL+"/api/orderByUserID/"+req.user._id;
  console.log("calling orders");
  request(url, function(err, response, body) {
    // JSON body
    if(err) { console.log(err); return; }
    var myOrders = JSON.parse(body);

    var totalPrice = 0;
    myOrders.forEach(function(d){
      totalPrice += d.price * d.quantity;
    });

    res.render("order.html", {"myOrder":myOrders, "total":totalPrice});

  });

});


router.get('/admin/restaurant',requireAdmin, function(req,res){

  res.render("admin_manage_restaurant.html", {"title":"Manage Restaurants"})
});

router.get('/admin/admin',requireAdmin, function(req,res){

  res.render("admin_manage_admin.html", {"title":"Manage Admins"})
});

router.get('/admin/menu',requireAdmin, function(req,res){

  res.render("admin_manage_menu.html", {"title":"Manage Menus"})
});

router.get('/admin/orders',requireAdmin, function(req,res){

  res.render("admin_manage_orders.html", {"title":"Manage Orders"})
});

module.exports = router;