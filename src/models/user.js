const mongoose = require("mongoose");

const newUser = new mongoose.Schema(
	{
		username: { type: String, required: true },
		city: { type: String, required: true },
		email: { type: String, required: true, unique: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("newUser", newUser);
