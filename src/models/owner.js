const mongoose = require("mongoose");

const Owner = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		fieldId: [
			{
				type: mongoose.Types.ObjectId,
				ref: "Fields",
				required: true,
				_id: false,
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Owner", Owner);
