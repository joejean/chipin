var mongoose = require("mongoose");
Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


var accountSchema = new Schema({
	userID: ObjectId,
	balance: Number
});

module.exports = mongoose.model("Account", accountSchema);
