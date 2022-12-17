const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const Fields = new mongoose.Schema(
	{
		userId: { type: ObjectId, ref: "Owner" },
		owner: { type: String, required: true },
		parentId: { type: ObjectId, ref: "Regions", required: true },
		parentName: { type: String, required: true },
		latitude: { type: String, required: true },
		longitude: { type: String, required: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Fields", Fields);
