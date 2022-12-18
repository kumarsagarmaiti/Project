const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const Regions = new mongoose.Schema(
	{
		userId: { type: ObjectId, ref: "Admin", _id: false },
		name: { type: String, required: true },
		parentId: { type: ObjectId, ref: "Properties", required: true, _id: false },
		parentName: { type: String, required: true },
		regions: [
			{ name: String, child: { type: ObjectId, ref: "Regions" }, _id: false },
		],
		fields: [
			{ name: String, child: { type: ObjectId, ref: "Fields" }, _id: false },
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Regions", Regions);
