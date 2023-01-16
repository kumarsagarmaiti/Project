const mongoose = require("mongoose");

const Order = new mongoose.Schema({
	customer_id: { type: mongoose.Types.ObjectId, ref: "newUser", required: true },
	orderCount: { type: Number },
	totalPrice: { type: Number },
});

module.exports = mongoose.model("Order", Order);
