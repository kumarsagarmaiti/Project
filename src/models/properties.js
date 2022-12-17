const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const Properties = new mongoose.Schema(
	{
		userId: { type: ObjectId, ref: "Admin" ,required:true},
		name: { type: String, required: true },
		parentId: { type: ObjectId, ref: "Organization", required: true },
		parentName: { type: String, required: true },
		regions: [{ name: String, child: { type: ObjectId, ref: "Regions" } }],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Properties", Properties);
