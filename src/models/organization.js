const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const Organization = new mongoose.Schema(
	{
		userId: { type: ObjectId, ref: "Admin", _id: false },
		name: { type: String, required: true },
		properties: [
			{
				name: String,
				child: { type: ObjectId, ref: "Properties" },
				_id: false,
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Organization", Organization);
