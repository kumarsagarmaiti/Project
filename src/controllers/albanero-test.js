const orders = require("../models/orders");
const User = require("../models/user");
var mongoose = require("mongoose");
var objectId = mongoose.Types.ObjectId;

const createUser = async function (req, res) {
	try {
		const data = req.body;
		const mandatoryFields = ["username", "city", "email"];
		for (let field of mandatoryFields) {
			if (!data[field])
				return res
					.status(400)
					.send({ status: false, message: `Please provide a valid ${field}` });
		}
		const isEmailPresent = await User.findOne({ email: data.email });
		if (isEmailPresent)
			return res.status(400).send({
				status: false,
				message: "The email has been taken. Please provide another email",
			});

		const createUser = await User.create(data);
		return res.status(201).send({
			status: true,
			message: "user successfully registered",
			data: createUser,
		});
	} catch (e) {
		return res.status(500).send(e.message);
	}
};

const getUsers = async function (req, res) {
	try {
		const city = req.query;
		const allUsers = await User.find();
		const obj = {};
		for (let user of allUsers) {
			if (obj[user.city]) {
				obj[user.city].push(user);
			} else {
				obj[user.city] = [user];
			}
		}
		return res.status(200).send({ data: obj });
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const createOrder = async function (req, res) {
	try {
		const data = req.body;
		const customerOrder = await orders.create(data);
		return res.status(201).send({
			status: true,
			message: "Order created successfully",
			data: customerOrder,
		});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const getOrder = async function (req, res) {
	try {
		let {userId} = req.params;
		userId = objectId(userId);
		const allOrders = await orders.find({ customer_id: userId });
		let orderCount = 0;
		let totalPrice = 0;
		const response = {
			customer_id: userId,
		};
		for (let order of allOrders) {
			orderCount += order.orderCount;
			totalPrice += order.totalPrice;
		}
		response.orderCount = orderCount;
		response.totalPrice = totalPrice;
		return res.status(200).send({
			status: true,
			data: response,
		});
	} catch (e) {
		res.send(e);
	}
};
module.exports = { createUser, getUsers, createOrder, getOrder };
