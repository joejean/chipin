var express = require('express');
var router = express.Router();


var User = require('../models/user');
var Restaurant = require('../models/restaurant');

/* GET users listing. */
router.get('/hello_world', function(req, res, next) {
  var newUser = User({userID: "mick", netID: "jj1192"});
  console.log(newUser);
  // res.json({message:'hello_world'});
  res.send('test');

});

router.post('/putRestaurant', function(req,res,next){
	console.log("asf");
	console.log(req.body);
	var myRes = new Restaurant({name: "mick", 
		address: "myAddress",
		foodItems: [1,2,3]});

	console.log(myRes);
	myRes.save(function(err){
	    if(err) {
	    	console.log(err);
	    }
	    else{
	        console.log(myRes);
	    }
	});
	console.log("saving data");
	
	Restaurant.find(function (err, myRes) {
	  if (err)  console.error(err);
	  else{
		  console.log(myRes);
	  }
	});

	console.log("returning data");


	// {
	// name: String, 
	// address: String,
	// phone: String, 
	// minimumAmount: Number,
	// waitTime: Number,
	// availableTime: String,
	// foodItems: [{
	// 	name:String, 
	// 	price: Number, 
	// 	type: String, 
	// 	description: String, 
	// 	availableTime: String 
	// }
	//
	var thisObj = {message: "hello_world"};
	res.json(thisObj);
});





module.exports = router;