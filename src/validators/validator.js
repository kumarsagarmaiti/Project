const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// To check the ObjectId we are getting is a valid ObjectId or not
const isValidObjectId = function (data) {
	return ObjectId.isValid(data);
};

// To check whether the input data is string or not after trimming
const isValidString = function (data) {
	if (typeof data != "string" || data.trim().length == 0) return false;
	return true;
};

// To check whether the title of author is among ["Mr", "Mrs", "Miss"] or not
const isValidTitle = function (data) {
	let arr = ["Mr", "Mrs", "Miss"];
	return arr.includes(data);
};

// To check if the email is valid or not
const isValidEmail = function (data) {
	const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return emailRegex.test(data);
};

// To check if the password contains uppercase, lowercase, speacial characters and numerics or not
const isValidPassword = function (data) {
	const passwordRegex =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,19})/;
	return passwordRegex.test(data);
};

// To check whether the input array is a valid array or not
const isValidArray = function (data) {
	if (
		!Array.isArray(data) ||
		data.length == 0 ||
		data.includes(undefined) ||
		data.filter((x) => x.trim().length > 0).length == 0
	)
		return false;
	return true;
};

// To convert the input into an array
const makeArray = function (data) {
	let arrayOfInput = data
		.split(",")
		.map((x) => x.toLowerCase().trim())
		.filter((x) => x.length > 0);
	return arrayOfInput;
};

// To flatten joined strings to individual strings into an array
const flattenArray = function (data) {
	let arrayOfInput = data
		.map((x) => [x.split(",").map((x) => x.trim().toLowerCase())])
		.flat(Infinity)
		.filter((x) => x.length > 0);
	return arrayOfInput;
};

// Check for valid request body
const isValidRequestBody = function (data) {
	return Object.keys(data).length != 0;
};

module.exports = {
	isValidEmail,
	isValidRequestBody,
	isValidObjectId,
	isValidPassword,
	isValidString,
	isValidTitle,
	isValidArray,
	makeArray,
	flattenArray,
};
