const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const Crops = new mongoose.Schema(
	{
		userId: { type: ObjectId, ref: "Admin" },
		months: [String],
		season: [String],
		crops: [String],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Crops", Crops);
