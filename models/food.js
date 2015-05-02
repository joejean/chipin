var mongoose = require("mongoose");
Schema = mongoose.Schema;

var foodSchema = new Schema({
	name:String, 
	price: Number, 
	type: String, 
	description: String, 
	availableTime: String 
});

module.exports = mongoose.model("Food", foodSchema);
