const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
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
		totalPrice: { type: Number, required: true },
		cancellable: { type: Boolean, default: true },
		status: {
			type: String,
			default: "pending",
			enum: ["pending", "completed", "cancelled"],
		},
		deletedAt: { type: Date, default: null },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
