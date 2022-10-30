const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const recentSchema = new mongoose.Schema(
	{
		ipAddress: String,
		products: [{ type: ObjectId, ref: "Product" }],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Recent", recentSchema);
