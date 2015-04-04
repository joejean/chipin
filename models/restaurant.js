var mongoose = require("mongoose");
Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


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

module.exports = mongoose.model("Restaurant", restaurantSchema);