const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const suggestionSchema = new mongoose.Schema(
	{
		ipAddress: String,
		products: [{ type: ObjectId, ref: "Product" }],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Suggestion", suggestionSchema);
