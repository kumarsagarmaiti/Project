const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const cartSchema = new mongoose.Schema(
	{
		userId: { type: ObjectId, required: true, trim: true, ref: "User" },
		selectSeats: [
			{
				movieId: { type: ObjectId, required: true, trim: true, ref: "Movies" },
				businessId: {
					type: ObjectId,
					required: true,
					trim: true,
					ref: "Business",
				},
				seats: [{ type: String, required: true }],
				time: { type: String, required: true },
				date: { type: Date, required: true },
				_id: false,
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
