const mongoose = require("mongoose");
const moment = require("moment");

const isValid = function (value) {
	if (
		typeof value === "undefined" ||
		value === null ||
		typeof value !== "string"
	)
		return false;
	if (typeof value === "string" && value.trim().length === 0) return false;
	return true;
};

let isValidEmail = function (email) {
	let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return emailRegex.test(email);
};

let isValidPassword = function (password) {
	let passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/;
	return passwordRegex.test(password);
};

let isValidObjectId = function (ObjectId) {
	return mongoose.isValidObjectId(ObjectId);
};

module.exports = {
	isValidEmail,
	isValidPassword,
	isValidObjectId,
	isValid,
};
