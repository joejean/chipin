var express = require('express');
var router = express.Router();
var async = require('async');


var User = require('../models/user');
var Restaurant = require('../models/restaurant').restaurantModel;
var Food = require('../models/restaurant').foodModel;
var Campaign = require('../models/campaign');
var Order = require("../models/order");
var Transaction = require("../models/transaction");
var Account = require("../models/account");
var Admin = require("../models/admin");

var formatTime = require('../lib/formatTime');


// ** GENERAL HELPER FUNCTIONS ** //

// general create and save - asyn function
function createAndSave( model, data, callback){
	var myRecord = new model(data);

	myRecord.save(function(err){
	    if(err) {
	    	callback(err, null);
	    }
	    else{
	        callback(null, myRecord);
	    }
	});
}

function findOneThisParam(model,key,val,callback){
  var param = {};
  param[key] = val;
  model.findOne(param, function (err, data) {
    if (err) {
      callback(err,null);
    } 
    else{
      callback(null,data);
    }
  });
}

function findThisParam(model,key,val,callback){
  var param = {};
  param[key] = val;
  model.find(param, function (err, data) {
    if (err) {
      callback(err,null);
    } 
    else{
      callback(null,data);
    }
  });
}

function addForeignData(model, foreignItem, keyParam, valParam, keyUpdate,callback){
  
  var myParam = {};
  myParam[keyParam] = valParam;
  var toUpdate = {};

  toUpdate[keyUpdate] = foreignItem;
  model.findOneAndUpdate(myParam, {$push: toUpdate}, function (err, data) {
    if (err) {
    	console.error(err);
    	callback(err,null);
    } 
    else{
    	callback(null,data);
    }
  });
}

function updateForeignData(model, foreignItem, keyParam, valParam, keyUpdate,callback){
  
  var myParam = {};
  myParam[keyParam] = valParam;
  var toUpdate = {};

  toUpdate[keyUpdate] = foreignItem;
  model.findOneAndUpdate(myParam, toUpdate, function (err, data) {
    if (err) {
    	console.error(err);
    	callback(err,null);
    } 
    else{
    	callback(null,data);
    }
  });
}



// --------------------- --------------------- --------------------- --------------------- //

// ** Campaign specific funtions ** //

// make campaigns needs restaurants id
// Input: restaurant object
//        endTime (date object in javascript new Date());
// Output: campaign object 

function makeCampaign(restaurant, deliveryTime){
  
  // console.log(restaurant.waitTime);
  // console.log(restaurant);
  var endTime = new Date(deliveryTime.getTime() - restaurant.waitTime * 60*1000);
  // console.log(endTime);
  var campaign = { restaurant: restaurant._id, 
                                currentStatus: "active",
                                endTime: endTime,
                                deliveryTime: deliveryTime,
                            	balance: 0} ;

  return campaign;
}


function makeCampaignFromName(restaurantName,deliveryTime,callback){

	findOneThisParam(Restaurant,"name",restaurantName,function(err,data){
		if (err){
		  callback(err, null);
		}
		else{
			if (data){
				callback(null, makeCampaign(data, deliveryTime));
			}
			else{
				callback(null, null);
			}
		}
	});
}
function makeCampaignFromID(restaurantID,deliveryTime,callback){

	findOneThisParam(Restaurant,"_id",restaurantID,function(err,data){
		if (err){
		  callback(err, null);
		}
		else{
			if (data){
				callback(null, makeCampaign(data, deliveryTime));
			}
			else{
				callback(null, null);
			}
		}
	});
}

// --------------------- --------------------- --------------------- --------------------- //

// return all restaurants
router.get('/allRestaurant', function(req,res,next){

	Restaurant.find({}, function (err, data) {
	  if (err) {
	  	console.error(err);
	  } 
	  else{

	  	res.json(data);

	  }
	});
});

// return the restaurant with given name
router.get('/restaurant/:name', function(req,res,next){


	findOneThisParam(Restaurant,"name",req.params.name, function (err, data) {
	  if (err) {
	  	console.error(err);
	  } 
	  else{
	 
		try{
			data.foodItems.forEach( function(d,i,arr){
				// var thisObj = JSON.parse(d);
				// console.log(thisObj.name);
				// data.foodItems[i] =  thisObj;
				console.log(d);
			});
	  	  	res.json(data);
	  	}
	  	catch(err){
	  		res.json([]);
	  	}
	  }
	});
});


// return the restaurant with given name
router.route('/admin')
.get(function(req,res,next){
	Admin.find({},function (err, data) {
	  if (err) {
	  	console.error(err);
	  } 
	  else{
  	  	res.json(data);
	  }
	});
})
.post(function(req, res, next){
	data = req.body;
	createAndSave(Admin,data.admins[0], function(err, admin){
		if (err){
			res.json([]);
		}
		else{
			res.json(admin);
		}
	});
});




// return the restaurant with given name
router.route('/restaurantByID/:id')
.get(function(req,res,next){
	findOneThisParam(Restaurant,"_id",req.params.id, function (err, data) {
	  if (err) {
	  	console.error(err);
	  } 
	  else{
  	  	res.json(data);
	  }
	});
})
.put(function(req, res, next){
	data = req.body;
	Restaurant.update({_id:req.params.id}, {$addToSet: {foodItems: {$each: data} }}, function(err){
		if (err){
			res.json({error:"Could not Save Menu Items"});
		}
		else{
			res.json({success:"success"});
		}
	});
});


// Put and delete restaurant to/from database - the function does not check whether it comes
// in the right format
router.route('/restaurant') 
.get(function(req,res,next){
	var query = Restaurant.find({}).select('name');
	query.exec(function(err, restaurants){
		if (err){
			res.json([]);
		}
		else{
			res.json(restaurants);
		}

	});
	
})
.post(function(req,res,next){
	var dat = req.body;
	createAndSave(Restaurant,dat, function(err,restaurant){
		if (err){
			res.json([]);
		}
		else{
			res.json(restaurant);
		}
	});
})
.delete(function(req,res,next){

	var data = req.body;
	Restaurant.remove({_id: data.id}, function(err){
		if (err){
			res.json({error:"Could not delete restaurant"});
		}
		else{
			res.json({success:"success"});
		}

	});
	

});

// MUST replace get campaing by restaurant
// the only access point that will also update if the 
router.get('/campaignByID/:campaignID', function(req,res,next){


	Campaign.find({_id:req.params.campaignID, currentStatus:"active"}).
	populate("restaurant").
	exec(function (err, data){
	// findThisParam(Campaign,"currentStatus" , "active", function(err,data){
		if (err){
			console.error(err);
		}
		else{
			//console.log(data);

			res.json(data);
		}
	});
});

// get all campaigns from a given restaurant
router.get('/campaign/:restaurantName', function(req,res,next){

	findOneThisParam(Restaurant,"name",req.params.restaurantName, function (err, data) {
	  if (err) {
	  	console.error(err);
	  } 
	  else{
		
		findThisParam(Campaign,"_id" , data._id, function(err,data){
			if (err){
				console.error(err);
			}
			else{
				
				res.json(data);
			}
		});
	  }
	});
});

// deactivate all the campaigns that time has passed
// notify admin of succeeding
// notify all users of failing
router.get('/pingCampaign',function(req,res,next){

	Campaign.
	where('currentStatus', 'active').
	where('endTime').lt(new Date()).
	populate("restaurant").
	exec(function (err, data) {
		if (err){
			console.error(err);
		}
		else{
			if(data.length !== 0){
				Campaign.findOne({_id:data[0].id},function(err,campaign){
					campaign.currentStatus="expired";
					campaign.save();

				});
				
				
			}
			res.json(data);
		}
	});

});


// get all campaigns an active campaign
router.get('/campaign', function(req,res,next){

	Campaign.find({currentStatus:"active"}).
	populate("restaurant").
	sort({deliveryTime:'asc'}).
	exec(function (err, data){
	// findThisParam(Campaign,"currentStatus" , "active", function(err,data){
		if (err){
			console.error(err);
		}
		else{
			//console.log(data);

			res.json(data);
		}
	});
});


// put campaign in the database
// {restaurantName: "restName", or restaurantID: "adf33xd"
// rawDate: 2011-5-11,
// rawTime: 5:00pm}

router.post('/campaign', function(req,res,next){

	// makeCampaignFromName(restaurantName,endTime,callback){
	var dat = req.body;

	var valDate = dat.rawDate; 
	var valTime = dat.rawTime;

	var dateToDeliver = new Date(valDate);

	var timeToDeliver = formatTime.getTimeMinute(valTime) * 60 * 1000;

	var dateTimeToDeliver = new Date( dateToDeliver.getTime() + timeToDeliver );
	async.waterfall([
	function(callback){

		// take in either restaurant name or restaurant id
		if (dat.restaurantName){
			makeCampaignFromName(dat.restaurantName, dateTimeToDeliver, function(err,dat){
			if (err){ console.log("makeCampErr"+err); callback(true); return; }
			callback(null, dat);
			});	
		}
		else if (dat.restaurantID){
			makeCampaignFromID(dat.restaurantID, dateTimeToDeliver, function(err,dat){
			if (err){ console.log("makeCampByIDErr"+err); callback(true); return; }
			callback(null, dat);
			});
		}
	},
	function(dat, callback){
		
		createAndSave(Campaign,dat, function(err,campaign){
			if (err){ console.log(err); callback(true); return; }
			callback(null,campaign)
		});
	}
	],
	function (err, result) {
	if(err) { console.log(err); res.json(null)}
	res.json(result);

	});

});


// get all transactions from a given campaign
router.get('/transaction/:campaignID', function (req,res,next){

	var givenParam = req.params;
	var myParam = {campaignID:givenParam.campaignID};
	Order.find(myParam, function(err,data){
		if (err){
			console.error(err);
		}
		else{
			
			var allTransactionsIDs = data.map(function(d){
				if(d.transactionID) return d.transactionID;
			});
			Transaction.find({'_id': {$in : allTransactionsIDs}}, function (err, docs){
				if(err) res.json([]);
				else res.json(docs);
			});
		}
	});
});

// put transaction in database - format assumed 
//
router.post('/transaction', function(req,res,next){
	var dat = req.body;
	createAndSave(Transaction,dat, function(err,transaction){
		if (err){
			res.json([]);
		}
		else{
			res.json(transaction);
		}
	});
});

// put LIST of orders in database -
// body has the format
router.post('/order/:campaignID/:userID', function(req,res,next){

	var givenParam = req.params;
	var dat = req.body;

	var transactionData = {};
	transactionData["time"] = new Date();
	//transactionData["accountID"] = givenParam.accountID;
	transactionData["type"] = "cash credit";
	
	//var thisAccountID = givenParam.accountID
	var thisCampaignID = givenParam.campaignID;
	var thisUserID = givenParam.userID;

	var orderBalance = 0;
	createAndSave(Transaction,transactionData, function(err,transaction){
		if (err){
			res.json(null);
		}
		else{

			var thisTransactionID = transaction._id;
	
			// making order object
			var orderData = (dat.order).map(function(d,i){
				var orderObj = {};
				orderObj["transactionID"] = thisTransactionID;
				orderObj["campaignID"] = thisCampaignID;
				orderObj["userID"] = thisUserID;
				orderObj["foodID"] = d._id;
				orderObj["quantity"] = d.quantity;
				orderObj["foodName"] = d.name;
				orderObj["price"] = d.price;
				orderBalance += d.totalPrice;
				return orderObj;
			});

			//async create and save
			async.forEach(orderData, createAndSave.bind(createAndSave, Order), function(err){
			    if (err) {
			    	console.error(err);
			    	res.json(null);
			    } else {

			    	Campaign.findOneAndUpdate({"_id":thisCampaignID}, {$inc: {"balance": orderBalance}}, function (err, data) {
			    		res.json(data);
			    	});

			    }
			});

		}
	});
});

// get all orders from a given campaign id
router.get('/orderByCampaignID/:campaignID', function (req,res,next){

	var givenParam = req.params;
	var myParam = {campaignID:givenParam.campaignID};
	Order.find(myParam, function(err,data){
		if (err){
			console.error(err);
		}
		else{
			
			res.json(data);
		}
	});
});

// get all orders from a given userID
router.get('/orderByUserID/:userID', function (req,res,next){

	var givenParam = req.params;
	var myParam = {userID:givenParam.userID};

	Order.find(myParam, function(err,data){
		if (err){
			console.error(err);
		}
		else{
			
			res.json(data);
		}
	});
});



// put account in database and link with user
// format as
// 	{userID: ObjectId,
//	balance: Number}
router.post('/account', function(req,res,next){

	var dat = req.body;
 	updateForeignData(User, dat._id, "userID", dat.userID, "accountID",function(err,data){
		if(err){
			res.json(null);
		}
		else{
			
			createAndSave(Account,dat, function(err,order){
				if (err){
					res.json([]);
				}
				else{
					res.json(order);
				}
			});
		}
 	});
});

// get user account
router.get('/account/:userID', function (req,res,next){

	var givenParam = req.params;
	var myParam = {userID:givenParam.userID};
	Account.find(myParam, function(err,data){
		if (err){
			console.error(err);
		}
		else{
			
			res.json(data);
		}
	});
});


// 
// body follows:
// schema of user
router.post('/user', function (req,res,next){

	var dat = req.body;

	User.update({"_id": dat._id}, dat,{upsert: true}, function (err, data) {
    if (err) {
    	console.error(err);
    	res.json(null);
    } 
    else{
    	
    	res.json(data);
    }
	});

});

// get user given id
router.get('/user/:userID', function (req,res,next){

	var givenParam = req.params;
	var myParam = {_id:givenParam.userID};
	User.find(myParam, function(err,data){
		if (err){
			console.error(err);
		}
		else{
			
			res.json(data);
		}
	});
});
module.exports = router;