const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		fname: { type: String, required: true, trim: true },
		lname: { type: String, required: true, trim: true },
		email: { type: String, required: true, trim: true, unique: true },
		profileImage: { type: String, required: true, trim: true },
		phone: { type: String, required: true, unique: true, trim: true },
		password: { type: String, required: true },
		address: {
			shipping: {
				street: { type: String },
				city: { type: String },
				pincode: { type: Number },
			},
			billing: {
				street: { type: String },
				city: { type: String },
				pincode: { type: Number },
			},
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
