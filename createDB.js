var pg = require('pg');

var conString = "postgres://postgres:12345@localhost/chipin";
//var conString = "postgres://username:password@localhost/database";

// string query for create database
var createQuery = ["campaign( campaignID  integer PRIMARY KEY ,restaurant  integer, startTime timestamp, endTime timestamp ,deliveryTime timestamp, currentStatus integer);",

"food(  foodID  integer PRIMARY KEY ,restaurant  integer,price decimal   ,name  varchar(30)   ,type  varchar(20)   ,description varchar(50)   ,availableTimeStart  time    ,availableTimeEnd  time    );",
        
"user(userID integer PRIMARY KEY ,userName varchar(100),password  varchar(100),netID integer,firstName varchar(20),lastName varchar(20),phoneNumber varchar(25),addressBuilding varchar(100),addressRoomNo integer,accountID integer,paypalID integer);",
        
"restaurant(  restaurantID  integer PRIMARY KEY ,name  varchar(100)   ,phoneNumber varchar(100)   ,minimumAmount integer,deliveryFee integer,availableTimeStart time ,availableTimeEnd  time    );",
        
"transaction( transactionID integer PRIMARY KEY ,executedTime  timestamp   ,creditAccount integer,type  smallint    );",
        
"creditAccount(accountID integer PRIMARY KEY,user integer);",
        
"order( campaign  integer,transaction integer,user  integer,food  integer,quantity integer,PRIMARY KEY (campaign, transaction, user, food) );"];




var client = new pg.Client(conString);

client.connect(function(err){

  if(err){
    return console.error("Could not connect to Postgres ", err);
  }
  for(i = 0; i< createQuery.length; i++){

    client.query('CREATE TABLE IF NOT EXISTS '+createQuery[i], function(err, result){
    if(err){
      return console.error("Error running query", err)
    }
    console.log(result);
    client.end();

  });

  }
 

});

