const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const Fields = new mongoose.Schema(
	{
		ownerId: { type: ObjectId, ref: "Owner", _id: false },
		owner: { type: String, required: true },
		parentId: { type: ObjectId, ref: "Regions", required: true, _id: false },
		parentName: { type: String, required: true },
		latitude: { type: String, required: true },
		longitude: { type: String, required: true },
		cropCycleId: { type: ObjectId, ref: "Crops", required: true, _id: false },
		crops: [String],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Fields", Fields);
