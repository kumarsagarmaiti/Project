const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		blocked: { type: Boolean, default: false },
		attempts: [Date],
		blockedSince: { type: Date, default: null },
		token: { type: String, default: "token" },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
