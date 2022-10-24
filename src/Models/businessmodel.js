const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const businessSchema = new mongoose.Schema(
	{
		userId: {
			type: ObjectId,
			required: true,
			trim: true,
			unique: true,
			ref: "User",
		},
		businessName: { type: String, required: true, trim: true, unique: true },
		GST: { type: String, required: true, trim: true, unique: true },
		address: {
			state: { type: String, required: true, trim: true },
			city: { type: String, required: true, trim: true },
			pincode: { type: Number, required: true, trim: true },
		},
		shows: [
			{
				date: {
					movieId: { type: ObjectId, ref: "Movies", required: true },
					timings: { type: String, required: true },
					screen: Number,
					availableSeats: [],
					ticketPrice: [],
					_id: false,
				},
			},
		],
		isDeleted: { type: Boolean, default: false },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Business", businessSchema);
