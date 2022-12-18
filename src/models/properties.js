const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const Properties = new mongoose.Schema(
	{
		userId: { type: ObjectId, ref: "Admin", required: true, _id: false },
		name: { type: String, required: true },
		parentId: {
			type: ObjectId,
			ref: "Organization",
			required: true,
			_id: false,
		},
		parentName: { type: String, required: true },
		regions: [
			{ name: String, child: { type: ObjectId, ref: "Regions" }, _id: false },
		],
		cropCycle: [
			{
				fieldId: { type: ObjectId, ref: "Fields", _id: false },
				cropCycleId: { type: ObjectId, ref: "Crops", _id: false },
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Properties", Properties);
