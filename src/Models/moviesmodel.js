const mongoose = require("mongoose");

const moviesSchema = new mongoose.Schema(
	{},
	{ timestamps: true, strict: false }
);

module.exports = mongoose.model("Movies", moviesSchema);
