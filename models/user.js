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

module.exports = mongoose.model("User", userSchema);
