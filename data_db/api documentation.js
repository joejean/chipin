//DOCUMENTATION API//


// return the restaurant with given name string
// if not found returns []
router.get('/restaurant/:name', function(req,res,next){
});


// put restaurant in database - the function does not check whether it comes
// in the right format
router.post('/restaurant', function(req,res,next){
});

// get all campaigns from a given restaurant name
router.get('/campaign/:restaurantName', function(req,res,next){

});


// get all active campaigns campaign
router.get('/campaign', function(req,res,next){

});

// put campaign in the database
// body follows: 
// {restaurantName: "restName", 
// "endTime": dateObject}
// current status is assumed to be active
// startTime is defuault now
// deliveryTime is endTime + waiting time given by the restauramt
router.post('/campaign', function(req,res,next){

});


// get all transactions from a given campaign
router.get('/transaction/:campaignID', function (req,res,next){

});

// put transaction in database - format assumed 
router.post('/transaction', function(req,res,next){

});

// put LIST of orders in database -
// body follows:
// [ {food: foodObject, quantity: Y1},
//   { foodID: foodObj, quantity: Y2}]
router.post('/order/:accountID/:campaignID/:userID', function(req,res,next){

});

// get all orders from a given campaign id
router.get('/order/:campaignID', function (req,res,next){

});

// put account in database and link with user
// once user is created, new account is not created with him
// body follows:
// 	{userID: ObjectId,
//	balance: Number}
router.post('/account', function(req,res,next){
});

// get user account
router.get('/account/:userID', function (req,res,next){
});



// body follows:
// schema of user
router.post('/user', function (req,res,next){
});

// get user given id
router.get('/user/:userID', function (req,res,next){
});
