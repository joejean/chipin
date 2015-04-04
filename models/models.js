var mongoose = require("mongoose");
Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = new Schema({

	userID: String,
	netID: String,
	name: String,
	phone: String,
	buildingNo: String,
	roomNo: Number,
	account: {accountID:Number, balance: Number}, 
	paypalID: String
	
});


var restaurantSchema = new Schema({
	name: String, 
	address: String,
	phone: String, 
	minimumAmount: Number,
	waitTime: Number,
	availableTime: String,
	foodItems: [{
		name:String, 
		price: Number, 
		type: String, 
		description: String, 
		availableTime: String 
	}]

});

var campaignSchema = new Schema({
	restaurant: ObjectId,
	startTime: {type: Date, default: Date.now},
	endTime: Date,
	deliveryTime: Date,
	currentStatus: String

});


var orderSchema = new Schema({
	transactionID: ObjectId,
	campaignID: ObjectId,
	userID: ObjectId,
	foodID: ObjectId,
	quantity: Number

});

var transactionSchema = new Schema({
	time: Date,
	accountID: ObjectId,
	type: String
});

var User = mongoose.model("User", schema.userSchema);
var Restaurant = mongoose.model("Restaurant", schema.restaurantSchema);
var Campaign = mongoose.model("Campaign", schema.campaignchema);
var Order = mongoose.model("Order", schema.orderSchema);
var Transaction = mongoose.model("Transaction", schema.transactionSchema);