var mongoose = require("mongoose");
Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


var AdminSchema = new Schema({
	name: {type: String, default:"Admin"},
	email: String
});


module.exports = mongoose.model("Admin", AdminSchema);
