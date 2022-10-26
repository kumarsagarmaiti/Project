const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		cartId: {
			type: mongoose.Schema.Types.ObjectId,
		},
		date:String,
		seats:[],
		totalPrice: { type: Number, required: true },
		cancellable: { type: Boolean, default: true },
		status: {
			type: String,
			default: "Completed",
		},
		deletedAt: { type: Date, default: null },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
