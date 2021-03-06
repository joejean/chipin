var mongoose = require("mongoose");
Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var orderSchema = new Schema({
	transactionID: ObjectId,
	campaignID: {type: ObjectId, ref:"Campaign"},
	userID: ObjectId,
	foodID: ObjectId,
	foodName: String,
	quantity: Number,
	price: Number

});

module.exports = mongoose.model("Order", orderSchema);


