const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const cartSchema = new mongoose.Schema(
	{
		userId: { type: ObjectId, required: true, trim: true, ref: "User" },
		movieId: { type: ObjectId, required: true, trim: true, ref: "Movies" },
		businessId: {
			type: ObjectId,
			required: true,
			trim: true,
			ref: "Business",
		},
		seats: [{ type: String, required: true }],
		time: { type: String, required: true },
		date: { type: String, required: true },
		totalPrice: { type: Number, required: true },
		expireAt: {
			type: Date,
			default: Date.now,
			index: { expires: "5m" },
		},
	},
	{ timestamps: true, expires: "5m" }
);
cartSchema.index({ expireAt: 1 }, { expires: "5m" });

module.exports = mongoose.model("Cart", cartSchema);
