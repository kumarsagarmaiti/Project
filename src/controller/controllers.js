const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/teacherModel");
const Student = require("../models/studentModel");
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/;
const numRegex = new RegExp("^[0-9]$");
const ObjectId = require("mongoose").Types.ObjectId;

const isValid = (value) => {
	if (
		typeof value === "undefined" ||
		value === null ||
		typeof value !== "string"
	)
		return false;
	if (typeof value === "string" && value.trim().length === 0) return false;
	return true;
};

const register = async (req, res) => {
	try {
		const data = req.body;
		if (Object.keys(data).length === 0)
			return res.status(400).send({
				status: false,
				message: "Please provide emailId and password",
			});

		const validFields = ["email", "password"];
		for (let field of validFields)
			if (!isValid(data[field]))
				return res
					.status(400)
					.send({ status: false, message: `Please provide a valid ${field}` });

		if (!data.email)
			return res
				.status(400)
				.send({ status: false, message: "Please provide email" });
		if (!data.password)
			return res
				.status(400)
				.send({ status: false, message: "Please provide password" });
		if (!emailRegex.test(data.email))
			return res
				.status(400)
				.send({ status: false, message: "Please provide a valid email" });
		if (!passwordRegex.test(data.password))
			return res.status(400).send({
				status: false,
				message:
					"Password must contain special characters, numbers, uppercase and lowercase and length should be between 8 to 15 characters",
			});

		const isEmailPresent = await Teacher.findOne({ email: data.email });
		if (isEmailPresent)
			return res.status(400).send({
				status: false,
				message: "User already present with the given emailId",
			});

		data.password = await bcrypt.hash(data.password, 10);

		const createUser = await Teacher.create(data);
		res.status(201).send({
			status: true,
			message: "User created successfully",
			data: createUser,
		});
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const loginUser = async (req, res) => {
	try {
		const data = req.body;
		if (Object.keys(data).length === 0)
			return res.status(400).send({
				status: false,
				message: "Please provide emailId and password",
			});
		const validFields = ["email", "password"];
		for (let field of validFields)
			if (!isValid(data[field]))
				return res
					.status(400)
					.send({ status: false, message: `Please provide a valid ${field}` });
		if (data.email) {
			if (!emailRegex.test(data.email))
				return res
					.status(400)
					.send({ status: false, message: "Email must be valid" });
		} else
			return res
				.status(400)
				.send({ status: false, message: "EmailId is mandatory" });

		const findUser = await Teacher.findOne({ email: data.email });
		if (!findUser)
			return res.status(404).send({
				status: false,
				message: "User not found with the given emailId",
			});

		const decryptedPass = bcrypt.compare(data.password, findUser.password);
		if (!decryptedPass)
			return res
				.status(401)
				.send({ status: false, message: "Incorrect password" });

		const token = jwt.sign({ userId: findUser._id }, "tailwind_assignment", {
			expiresIn: "30mins",
		});

		const studentData = await Student.find({ userId: findUser._id });
		return res.status(200).send({
			status: true,
			message: "User login successfull",
			data: { userId: user._id, token: token, data: studentData },
		});
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const getStudent = async (req, res) => {
	try {
		let data = {};
		data = req.query;
		if (Object.keys(data).length === 0) {
			const studentData = await Student.find({ userId: req.userId });
			if (studentData.length == 0)
				return res
					.status(200)
					.send({ status: true, message: "No student recorded yet" });
			else
				return res.status(201).send({
					status: true,
					data: studentData,
				});
		}

		const queryFields = Object.keys(data);
		for (let field of queryFields)
			if (!isValid(data[field]))
				return res
					.status(400)
					.send({ status: false, message: `Please provide a valid ${field}` });

		data.userId = req.userId;

		const studentData = await Student.find({ data });
		if (studentData.length == 0)
			return res
				.status(200)
				.send({ status: true, message: "No student recorded yet" });
		else
			return res.status(201).send({
				status: true,
				data: studentData,
			});
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const editStudents = async (req, res) => {
	try {
		const data = req.body;
		if (Object.keys(data).length === 0)
			return res.status(400).send({
				status: false,
				message: "Please provide student data",
			});

		const mandatoryFields = ["name", "subject", "marks"];
		for (let field of mandatoryFields) {
			if (!data[field])
				return res
					.status(400)
					.status({ status: false, message: `Please provide ${field}` });
			if (field == "marks") continue;
			if (!isValid(data[field]))
				return res
					.status(400)
					.send({ status: false, message: `Please provide a valid ${field}` });
		}

		if (!numRegex.test(data.marks))
			return res
				.status(400)
				.send({ status: false, message: "Please provide valid marks" });

		const editData = await Student.findOneAndUpdate(
			{
				userId: req.userId,
				name: data.name,
				subject: data.subject,
				marks: data.marks,
			},
			{ $set: { $inc: { marks: data.marks } } },
			{ new: true, upsert: true }
		);

		return res.status(200).send({ status: true, data: editData });
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const deleteStudents = async (req, res) => {
	try {
		const studentId = req.params.studentId;
		if (!studentId)
			return res
				.status(400)
				.send({ status: false, message: "Please provide studentId" });
		if (!ObjectId.isValid(studentId))
			return res
				.status(400)
				.send({ status: false, message: "Invalid studentID" });
		const findStudent = await Student.findOneAndUpdate(
			{ userId: req.userId, _id: studentId, isDeleted: false },
			{ $set: { isDeleted: true, deletedAt: new Date() } },
			{ new: true }
		);
		if (!findStudent)
			return res
				.status(404)
				.send({
					status: false,
					message: "No student found with the given details",
				});
		else
			return res
				.status(200)
				.send({ status: true, message: "Data deleted successfully" });
	} catch (error) {
		res.status(500).send(error.message);
	}
};
