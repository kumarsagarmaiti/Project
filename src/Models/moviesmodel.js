const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const moviesSchema = new mongoose.Schema(
	{
		name: { type: String, trim: true, unique: true, required: true },
		starring: [{ type: String, trim: true, required: true }],
		ratings: Number,
		reviews: { type: String, trim: true, default: "No reviews yet" },
		posterImage: { type: String, unique: true, trim: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Movies", moviesSchema);
