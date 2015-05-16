var mongoose = require("mongoose");
Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var campaignSchema = new Schema({
	restaurant: ObjectId,
	startTime: {type: Date, default: Date.now},
	endTime: Date,
	deliveryTime: Date,
	currentStatus: {type:String, default:'active'},
	balance: Number
});

module.exports = mongoose.model("Campaign", campaignSchema);
