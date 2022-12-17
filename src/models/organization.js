const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const Organization = new mongoose.Schema(
	{
		userId: { type: ObjectId, ref: "Admin" },
		name: { type: String, required: true },
		properties: [
			{ name: String, child: { type: ObjectId, ref: "Properties" } },
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Organization", Organization);
