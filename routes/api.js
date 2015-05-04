var express = require('express');
var router = express.Router();
var async = require('async');


var User = require('../models/user');
var Restaurant = require('../models/restaurant').restaurantModel;
var Food = require('../models/restaurant').foodModel;
var Campaign = require('../models/campaign');
var Order = require("../models/order");
var Transaction = require("../models/transaction")
var Account = require("../models/account")


// ** GENERAL HELPER FUNCTIONS ** //

// general create and save - asyn function
function createAndSave( model, data, callback){
	var myRecord = new model(data);

	console.log(myRecord);
	myRecord.save(function(err){
	    if(err) {
	    	console.log("error saving");
	    	console.log(err);
	    	callback(err, null);
	    }
	    else{
	        console.log(myRecord);
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
    	console.log(data);
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
    	console.log(data);
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

function makeCampaign(restaurant, endTime){
  
  // console.log(restaurant.waitTime);
  console.log(restaurant);
  var deliveryTime = new Date(endTime.getTime() + restaurant.waitTime * 60*1000);
  console.log(deliveryTime);
  var campaign = new Campaign({ restaurant: restaurant._id, 
                                currentStatus: "active",
                                endTime: endTime,
                                deliveryTime: deliveryTime,
                            	balance: 0} );

  return campaign;
}


function makeCampaignFromName(restaurantName,endTime,callback){

	findOneThisParam(Restaurant,"name",restaurantName,function(err,data){
		if (err){
		  callback(err, null);
		}
		else{
			if (data){
				callback(null, makeCampaign(data, endTime));
			}
			else{
				callback(null, null);
			}
		}
	});
}

// --------------------- --------------------- --------------------- --------------------- //

// return the restaurant with given name
router.get('/restaurant/:name', function(req,res,next){


	findOneThisParam(Restaurant,"name",req.params.name, function (err, data) {
	  if (err) {
	  	console.error(err);
	  } 
	  else{
	  	console.log("in get rest");
		console.log(data);
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

// put restaurant in database - the function does not check whether it comes
// in the right format
router.post('/restaurant', function(req,res,next){
	var dat = req.body;
	createAndSave(Restaurant,dat, function(err,restaurant){
		if (err){
			res.json([]);
		}
		else{
			res.json(restaurant);
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
		console.log(data);
		findThisParam(Campaign,"_id" , data._id, function(err,data){
			if (err){
				console.error(err);
			}
			else{
				console.log("data from given restaturant");
				console.log(data);
				res.json(data);
			}
		});

	  }
	});
});


// get all campaigns an active campaign
router.get('/campaign', function(req,res,next){
	findThisParam(Campaign,"currentStatus" , "active", function(err,data){
		if (err){
			console.error(err);
		}
		else{
			console.log(data);

			res.json(data);
		}
	});
});

// put campaign in the database
// {restaurantName: "restName", 
// "endTime": new Data()}
router.post('/campaign', function(req,res,next){

	// makeCampaignFromName(restaurantName,endTime,callback){
	var dat = req.body;
	makeCampaignFromName(dat.restaurantName, new Date(dat.endTime), function(err,dat){
		if (err){
			console.error(err);
			res.json(null);
		}
		else{
			if (dat){
				createAndSave(Campaign,dat, function(err,campaign){
					if (err){
						console.error(err);
						res.json(null);
					}
					else{
						res.json(campaign);
					}
				});
			}
			else{
				console.error(err);
				res.json(null);
			}
		}
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
			console.log(data);
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
// [ {food: foodObject, quantity: Y1},{ foodID: foodObj, quantity: Y2}]
router.post('/order/:accountID/:campaignID/:userID', function(req,res,next){

	var givenParam = req.params;
	console.log(givenParam);

	var transactionData = {};
	transactionData["time"] = new Date();
	transactionData["accountID"] = givenParam.accountID;
	transactionData["type"] = "cash credit";
	
	var thisAccountID = givenParam.accountID
	var thisCampaignID = givenParam.campaignID;
	var thisUserID = givenParam.userID;

	var orderBalance = 0;
	createAndSave(Transaction,transactionData, function(err,transaction){
		if (err){
			res.json(null);
		}
		else{

			var thisTransactionID = transaction._id;
			var dat = req.body;
			if (dat.constructor !== Array){
				dat = [dat];
			}

			// making order object
			var orderData = dat.map(function(d,i){
				var orderObj = {};
				orderObj["transactionID"] = thisTransactionID;
				orderObj["campaignID"] = thisCampaignID;
				orderObj["userID"] = thisUserID;
				orderObj["foodID"] = d.food._id;
				orderObj["quantity"] = d.quantity;
				orderBalance += d.quantity* d.food.price;
				return orderObj;
			});

			//async create and save
			async.forEach(dat, createAndSave.bind(createAndSave, Order), function(err){
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
router.get('/order/:campaignID', function (req,res,next){

	var givenParam = req.params;
	var myParam = {campaignID:givenParam.campaignID};
	Order.find(myParam, function(err,data){
		if (err){
			console.error(err);
		}
		else{
			console.log(data);
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
			console.log("updated user");
			console.log(data);
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
			console.log(data);
			res.json(data);
		}
	});
});




module.exports = router;