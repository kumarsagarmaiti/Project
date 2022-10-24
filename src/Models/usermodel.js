const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new mongoose.Schema(
	{
		fname: { type: String, required: true, trim: true },
		lname: { type: String, required: true, trim: true },
		email: { type: String, required: true, trim: true, unique: true },
		password: { type: String, required: true, trim: true },
		phone: { type: String, required: true, trim: true, unique: true },
		address: {
			state: { type: String, required: true, trim: true },
			city: { type: String, required: true, trim: true },
			pincode: { type: Number, required: true, trim: true },
		},
		isDeleted: { type: Boolean, default: false },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
