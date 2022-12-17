const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const Regions = new mongoose.Schema(
	{
		userId: { type: ObjectId, ref: "Admin" },
		name: { type: String, required: true },
		parentId: { type: ObjectId, ref: "Properties", required: true },
		parentName: { type: String, required: true },
		regions: [{ name: String, child: { type: ObjectId, ref: "Regions" } }],
		fields: [{ name: String, child: { type: ObjectId, ref: "Fields" } }],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Regions", Regions);
