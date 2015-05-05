var mongoose = require("mongoose");
Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


var userSchema = new Schema({
    
	email: String,
	name: String,
	phone: String,
	buildingNo: String,
	roomNo: Number,
	//accountID: ObjectId,
	paypalID: String
	
});


module.exports = mongoose.model("User", userSchema);
