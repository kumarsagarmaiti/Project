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

const isValidInputBody = function (object) {
	return Object.keys(object).length > 0;
};

let isValidPhone = function (number) {
	let phoneRegex = /^[6-9]\d{9}$/;
	return phoneRegex.test(number);
};

let isValidEmail = function (email) {
	let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return emailRegex.test(email);
};

let isValidPassword = function (password) {
	let passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/;
	return passwordRegex.test(password);
};

let isValidDateFormat = function (date) {
	let dateFormatRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
	return dateFormatRegex.test(date);
};

let isValidDate = function (date) {
	return moment(date).isValid();
};

let isValidObjectId = function (ObjectId) {
	return mongoose.isValidObjectId(ObjectId);
};

const acceptFileType = (file, types) => {
	return types.indexOf(file[0].mimetype) == -1;
};

const isPincodeValid = function (value) {
	return /^[1-9]{1}[0-9]{5}$/.test(value);
};

let isValidJSONstr = (json) => {
	try {
		return JSON.parse(json);
	} catch (err) {
		return false;
	}
};

let checkArrContent = (array, isContentArray) => {
	array.forEach((e) => {
		if (!isContentArray.includes(e)) return true;
	});
	return false;
};

module.exports = {
	isValidEmail,
	isValidPhone,
	isValidPassword,
	isValidObjectId,
	isValidDateFormat,
	isValidDate,
	acceptFileType,
	isValidJSONstr,
	isPincodeValid,
	checkArrContent,
	isValid,
	isValidInputBody,
};
