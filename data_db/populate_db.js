var async = require('async');

var express = require('express');
var config = require("../config");
var mongoose = require("mongoose");
mongoose.connect(config.db.uri);

var Restaurant = require('../models/restaurant').restaurantModel;
var Food = require('../models/restaurant').foodModel;
// var testExport = require('../models/restaurant').testExport;

// console.log(testExport);
// var newRes = new Restaurant();
// var newFood = new Food();
// console.log(newFood);


function populateDB (model,d,callback){
		var record = new model(d);
    console.log(record);
		record.save(function(err){
		    if(err) {
          callback(err,null);
		    	console.error(err);
		    }
		    else{
            console.log("saving");
            callback(null,record);
		        console.log(record);
		    }
		});
};


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

// add data as the foreign object that the model is referring to
//

function addForeignData(model, foreignItem, keyParam, valParam, keyUpdate){
  
  var myParam = {};
  myParam[keyParam] = valParam;
  var toUpdate = {};

  toUpdate[keyUpdate] = foreignItem;
  model.findOneAndUpdate(myParam, {$push: toUpdate}, function (err, data) {
    if (err) {
      console.error(err);
    } 
    else{
      console.log(data);
    }
  });
}


//  DATA //

// to convert csv to json - http://www.convertcsv.com/csv-to-json.htm

var restaurantAll = [
  {
    "name":"beijing",
    "address":"add1",
    "phone":"02-466-8485",
    "minimumAmount":100,
    "waitTime":30,
    "availableTime":"17:00-21:00",
  },
  {
    "name":"lebanese flower",
    "address":"add2",
    "phone":"02-349-8110",
    "minimumAmount":120,
    "waitTime":40,
    "availableTime":"13:00-23:00"
  },
  {
    "name":"alkram",
    "address":"add3",
    "phone":"02-894-1313",
    "minimumAmount":100,
    "waitTime":30,
    "availableTime":"16:00-19:00"
  }
];

var foodAll = [
  {
    "restName":"beijing",
    "name":"dumplings",
    "price":10,
    "type":"appetizer",
    "description":"",
    "availableTime":""
  },
  {
    "restName":"beijing",
    "name":"noodles",
    "price":20,
    "type":"main",
    "description":"",
    "availableTime":""
  },
  {
    "restName":"beijing",
    "name":"fried rice",
    "price":10,
    "type":"main",
    "description":"",
    "availableTime":""
  },
  {
    "restName":"beijing",
    "name":"roasted duck",
    "price":70,
    "type":"main",
    "description":"",
    "availableTime":""
  },
  {
    "restName":"beijing",
    "name":"egg tart",
    "price":5,
    "type":"dessert",
    "description":"",
    "availableTime":""
  },
  {
    "restName":"lebanese flower",
    "name":"hummus",
    "price":30,
    "type":"appetizer",
    "description":"",
    "availableTime":""
  },
  {
    "restName":"lebanese flower",
    "name":"vine leaves",
    "price":20,
    "type":"appetizer",
    "description":"",
    "availableTime":""
  },
  {
    "restName":"lebanese flower",
    "name":"mixed grill",
    "price":40,
    "type":"main",
    "description":"",
    "availableTime":""
  },
  {
    "restName":"lebanese flower",
    "name":"tawoosh",
    "price":30,
    "type":"main",
    "description":"",
    "availableTime":""
  },
  {
    "restName":"lebanese flower",
    "name":"hammor",
    "price":40,
    "type":"main",
    "description":"",
    "availableTime":""
  },
  {
    "restName":"lebanese flower",
    "name":"avocado juice",
    "price":5,
    "type":"juice",
    "description":"",
    "availableTime":""
  },
  {
    "restName":"alkram",
    "name":"garlic nan",
    "price":5,
    "type":"bread",
    "description":"",
    "availableTime":""
  },
  {
    "restName":"alkram",
    "name":"palak paneer",
    "price":10,
    "type":"main",
    "description":"",
    "availableTime":""
  },
  {
    "restName":"alkram",
    "name":"aloo palak",
    "price":15,
    "type":"main",
    "description":"",
    "availableTime":""
  },
  {
    "restName":"alkram",
    "name":"butter chicken",
    "price":20,
    "type":"main",
    "description":"",
    "availableTime":""
  },
  {
    "restName":"alkram",
    "name":"ginger chicken",
    "price":20,
    "type":"main",
    "description":"",
    "availableTime":""
  },
  {
    "restName":"alkram",
    "name":"chana masala",
    "price":20,
    "type":"main",
    "description":"",
    "availableTime":""
  }
];

// populate restaurants
async.forEach(restaurantAll, populateDB.bind(populateDB, Restaurant), function(err){
    if (err) {   
      console.error(err);
    } else {
      console.log("done");
      // populate food to each item
      foodAll.forEach( function(d){
        // console.log(d.restName);
        var myFood = new Food(d);
        console.log(myFood);
        addForeignData(Restaurant, myFood, "name", d.restName, "foodItems");
      });

    }
});





