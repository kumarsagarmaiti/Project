const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const studentSchema = new mongoose.Schema(
	{
		userId: { type: ObjectId, ref: "Teacher", required: true, trim: true },
		name: { type: String, required: true, trim: true },
		subject: { type: String, required: true, trim: true },
		marks: { type: Number, required: true },
    isDeleted:{type:Boolean,default:false},
    deletedAt:{type:Date,default:null}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
