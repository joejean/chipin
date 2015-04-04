var mongoose = require("mongoose");
Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


var transactionSchema = new Schema({
	time: Date,
	accountID: ObjectId,
	type: String
});

module.exports = mongoose.model("Transaction", transactionSchema);
