const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const businessSchema = new mongoose.Schema(
	{
		fname: { type: String, required: true, trim: true },
		lname: { type: String, required: true, trim: true },
		email: { type: String, required: true, trim: true, unique: true },
		password: { type: String, required: true, trim: true },
		phone: { type: String, required: true, trim: true, unique: true },
		GST: { type: String, required: true, trim: true, unique: true },
		businessName: { type: String, required: true, trim: true, unique: true },
		address: {
			state: { type: String, required: true, trim: true },
			city: { type: String, required: true, trim: true },
			pincode: { type: Number, required: true, trim: true },
		},
		shows: [
			{
				movieId: { type: ObjectId, ref: "Movies", required: true },
				timings: [{ type: String, required: true }],
				dates: [{ type: Date, required: true }],
				availableSeats: [{ type: String, required: true }],
				ticketPrice: [{ type: String, required: true }],
				_id: false,
			},
		],
		isDeleted: { type: Boolean, default: null },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Business", businessSchema);
