var mongoose = require("mongoose");
Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
// var Food = require("./food")


// duplicate with food.js
var foodSchema = new Schema({
	name:String, 
	price: Number, 
	type: String, 
	description: String, 
	availableTime: String 
});

var restaurantSchema = new Schema({
	name: String, 
	address: String,
	phone: String, 
	minimumAmount: Number,
	waitTime: Number,
	availableTime: String,
	foodItems: [foodSchema]

});

module.exports = {
			restaurantModel: mongoose.model("Restaurant", restaurantSchema),
			foodModel: mongoose.model("Food", foodSchema)
			};
