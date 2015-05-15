var mongoose = require("mongoose");
Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


var AdminSchema = new Schema({
	email: String
});


module.exports = mongoose.model("Admin", AdminSchema);
