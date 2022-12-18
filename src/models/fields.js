const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const Fields = new mongoose.Schema(
	{
		ownerId: { type: ObjectId, ref: "Owner" },
		owner: { type: String, required: true },
		parentId: { type: ObjectId, ref: "Regions", required: true },
		parentName: { type: String, required: true },
		latitude: { type: String, required: true },
		longitude: { type: String, required: true },
		cropCycleId: { type: ObjectId, ref: "Crops", required: true },
		crops: [String],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Fields", Fields);
