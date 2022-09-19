const internModel = require("../models/internModel");
const collegeModel = require("../models/collegeModel");

const isValidString = function (data) {
	if (typeof data != "string" || data.trim().length == 0) {
		return false;
	}
	return true;
};

const isValidUrl = function (data) {
	const urlRegex =
		/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/;
	return urlRegex.test(data);
};

const checkNumbersInString = function (data) {
	const checkNumbersInStringRegex = /^[a-zA-Z ]*$/;
	return checkNumbersInStringRegex.test(data);
};

const createCollege = async function (req, res) {
	try {
		// Checking if the request body is empty or not
		if (Object.keys(req.body).length === 0)
			return res.status(400).send({ status: false, msg: "Required data" });

		const requiredFields = ["name", "fullName", "logoLink"];

		// Checking if the required fields are present or not
		for (field of requiredFields) {
			if (!req["body"].hasOwnProperty(field))
				return res
					.status(400)
					.send({ status: false, msg: `Please provide ${field}` });
		}
		//Checking if the name contains numbers or not
		const onlyLetters = ["name", "fullName"];
		for (field of onlyLetters) {
			if (!checkNumbersInString(req.body[field])) {
				return res
					.status(400)
					.send({ status: false, msg: `${field} should only contain letters` });
			}
		}
		// Checking if the value is a valid string or not
		for (field of requiredFields) {
			if (!isValidString(req.body[field]))
				return res
					.status(400)
					.send({ status: false, msg: `Please provide a valid ${field}` });
		}
		//Checking if there is no field other than the specified
		for (key in req.body) {
			if (!requiredFields.includes(key))
				return res.status(400).send({
					status: false,
					msg: `Fields can only be among these: ${requiredFields.join(", ")}`,
				});
		}
		// Checking if the logoLink is a valid or not
		if (!isValidUrl(req.body.logoLink.trim())) {
			return res
				.status(400)
				.send({ status: false, msg: "logoLink is invalid" });
		}

		// Storing req.body in requestBody variable
		const requestBody = req.body;

		// Checking if the college name already exists or not
		const checkName = await collegeModel.findOne({
			name: requestBody.name.trim(),
		});
		if (checkName)
			return res
				.status(400)
				.send({ status: false, msg: "Name already present" });

		// Creating a new college
		const createNewCollege = await collegeModel.create(requestBody);
		res.status(201).send({ status: true, data: createNewCollege });
	} catch (error) {
		res.status(500).send({ status: false, msg: error.message });
	}
};

const getInterns = async function (req, res) {
	try {
		res.header("Access-Control-Allow-Origin", "*");
		let data = req.query;
		// Checking if the data is empty or not
		if (Object.keys(data).length === 0) {
			return res.status(400).send({ status: false, msg: "requied filters" });
		}
		//Checking if the required keys are present or not
		if (!data.hasOwnProperty("collegeName")) {
			return res
				.status(400)
				.send({ status: false, msg: "requied collegeName" });
		}
		//Checking if the value of key is present or not
		if (!data.collegeName.trim()) {
			return res
				.status(400)
				.send({ status: false, msg: "please provide collegeName" });
		}
		//Checking if there is no filters other than the specified
		for (key in data) {
			if (!["collegeName"].includes(key)) {
				return res
					.status(400)
					.send({ status: false, msg: "use only filter collegeName" });
			}
		}
		// Checking if the college name exists or not
		let findDocument = await collegeModel
			.findOne({
				name: data.collegeName.trim(),
				isDeleted: false,
			})
			.select({ name: 1, fullName: 1, logoLink: 1 })
			.lean();
		if (!findDocument) {
			return res
				.status(404)
				.send({ status: false, msg: "no such clg with the give collegeName" });
		}
		let Id = findDocument._id;
		let getInterns = await internModel.find({
			collegeId: Id,
			isDeleted: false,
		});
		if (getInterns.length === 0) {
			delete findDocument["_id"];
			findDocument.interns = "interns not found";
			return res.status(200).send({ status: true, data: findDocument });
		}
		delete findDocument["_id"];
		findDocument.interns = [...getInterns];
		return res.status(200).send({ status: true, data: findDocument });
	} catch (err) {
		res.status(500).send({ status: false, msg: err.message });
	}
};

module.exports = { createCollege, getInterns };
