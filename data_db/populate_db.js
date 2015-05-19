var async = require('async');

var express = require('express');
var config = require("../config");
var mongoose = require("mongoose");
mongoose.connect(config.db.uri);

var Restaurant = require('../models/restaurant').restaurantModel;
var Food = require('../models/restaurant').foodModel;
var Campaign = require('../models/campaign');
var Admin = require('../models/admin');



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


function makeCampaign(restaurant, endTime){
  
  // console.log(restaurant.waitTime);
  console.log(restaurant);
  var deliveryTime = new Date(endTime.getTime() + restaurant.waitTime * 60*1000);
  console.log(deliveryTime);
  var campaign = { restaurant: restaurant._id, 
                                currentStatus: "active",
                                endTime: endTime,
                                deliveryTime: deliveryTime,
                              balance: 0};

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

function createOneToyCampaign(){
  var endDate = new Date();
  var myRes = "meowFood";
  var endTime = new Date(endDate.getTime() + 4*60 *60*1000);


  makeCampaignFromName(myRes,endTime, function(err,dat){
    populateDB (Campaign,dat,function(err,dat){
      if(dat){
        console.log(dat);
      }
    });

  });

}

/*var admins = [
  {"name":"Joe Jean", "email":"jj1347@nyu.edu"},
  {"name":"Rock Zou", "email":"jj1347@nyu.edu"},
  {"name":"Jerome White", "email":"jj1347@nyu.edu"},
  {"name":"Mick", "email":"jj1347@nyu.edu"},
]*/

function addAdmin() {
  var admin = new Admin({name:'Joe Jean', email:"jj1347@nyu.edu"});
  admin.save(function(err){
    if (err) console.log(err);
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
    "startTime":"5:00pm",
    "endTime":"9:00pm",
    "imageUrl": "http://graphics8.nytimes.com/images/2013/11/22/business/dbpix-darden/dbpix-darden-tmagArticle.jpg"
  },
  {
    "name":"lebanese flower",
    "address":"add2",
    "phone":"02-349-8110",
    "minimumAmount":120,
    "waitTime":40,
    "startTime":"1:00pm",
    "endTime":"11:00pm",
    "imageUrl": "http://www.bighospitality.co.uk/var/plain_site/storage/images/publications/hospitality/bighospitality.co.uk/business/tortilla-secures-seven-sites-for-restaurants-inside-and-outside-london/8401879-1-eng-GB/Tortilla-secures-seven-sites-for-restaurants-inside-and-outside-London_medium_vga.jpg"
  },
  {
    "name":"alkram",
    "address":"add3",
    "phone":"02-894-1313",
    "minimumAmount":100,
    "waitTime":30,
    "startTime":"4:00pm",
    "endTime":"7:00pm",
    "imageUrl": "http://media-cdn.tripadvisor.com/media/photo-s/01/71/5f/b8/outside-of-the-restaurant.jpg"
  },
  {
    "name":"meowFood",
    "address":"add4",
    "phone":" 02-894-9999",
    "minimumAmount":100,
    "waitTime":40,
    "startTime":"8:00pm",
    "endTime":"9:00pm",
    "imageUrl": "https://geekalabama.files.wordpress.com/2012/06/2012-06-20-19-25-31-2.jpg"
  }
]

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
  },
  {
    "restName":"meowFood",
    "name":"crispy tuna meow",
    "price":20,
    "type":"main",
    "description":"",
    "availableTime":""
  },
  {
    "restName":"meowFood",
    "name":"fried fish bones",
    "price":5,
    "type":"appetizer",
    "description":"",
    "availableTime":""
  },
  {
    "restName":"meowFood",
    "name":"salmon milk sauce",
    "price":30,
    "type":" main",
    "description":"",
    "availableTime":""
  },
  {
    "restName":"meowFood",
    "name":"spaghetti yarn ball",
    "price":20,
    "type":" main",
    "description":"",
    "availableTime":""
  }
];

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
      createOneToyCampaign();



    }
});

addAdmin();


