const Order = require("../Models/ordermodel");
const Cart = require("../Models/cartmodel");
const Business = require("../Models/businessmodel");
const validate = require("../Utils/validator");
const moment = require("moment");

const createOrder = async function (req, res) {
	try {
		const userId = req.params.userId;
		const { cartId, businessId } = req.body;
		if (!validate.isValidInputBody(req.body))
			return res
				.status(400)
				.send({ status: false, message: "Please provide order data" });

		for (value of Object.values(req.body)) {
			if (!validate.isValidObjectId(value))
				return res
					.status(400)
					.send({ status: false, message: `Invalid objectId: ${value}` });
		}

		const findCart = await Cart.findOne({ userId, _id: cartId, businessId });
		if (!findCart)
			return res.status(404).send({ status: false, message: "Cart not found" });
		const findBusiness = await Business.findOne({
			_id: businessId,
			isDeleted: false,
		}).lean();

		for (show of findBusiness.shows[findCart.date]) {
			for (seat of findCart.seats) {
				show.availableSeats[seat] = "Unavailable";
			}
		}

		req.body.totalPrice = findCart.totalPrice;
		req.body.date = findCart.date;
		req.body.userId = userId;
		req.body.seats = findCart.seats;
		req.body.time = findCart.time;
		req.body.businessId = findCart.businessId;

		const updateBusiness = await Business.findByIdAndUpdate(
			businessId,
			findBusiness
		);
		const deleteCart = await Cart.findOneAndRemove({ _id: req.body.cartId });

		const createOrder = await Order.create(req.body);
		res.status(201).send({ status: true, data: createOrder });
	} catch (error) {
		res.status(500).send({ status: false, message: error.message });
	}
};

const getOrder = async function (req, res) {
	try {
		if (!req.body.orderId || !validate.isValidObjectId(req.body.orderId))
			return res
				.status(400)
				.send({ status: false, message: "Please provide a valid orderId" });

		const findOrder = await Order.findOne({
			_id: req.body.orderId,
			isDeleted: false,
		});
		if (!findOrder)
			return res
				.status(404)
				.send({ status: false, message: "Order not found" });
		res.status(200).send({ status: true, data: findOrder });
	} catch (error) {
		res.status(500).send({ status: false, message: error.message });
	}
};

const cancelOrder = async function (req, res) {
	try {
		if (!req.body.orderId || !validate.isValidObjectId(req.body.orderId))
			return res
				.status(400)
				.send({ status: false, message: "Please provide a valid orderId" });

		const findOrder = await Order.findOne({
			_id: req.body.orderId,
			isDeleted: false,
		});

		if (findOrder.status == "Cancelled")
			return res
				.status(400)
				.send({ status: false, message: "Order has already been cancelled" });

		const date = findOrder.date;
		const time = findOrder.time;
		const relativeDate = moment(date, "DD/MM/YYYY").fromNow();
		if (
			!(relativeDate.split(" ")[0] == "in") &&
			relativeDate.split(" ")[1] != "hours"
		)
			return res
				.status(400)
				.send({ status: false, message: "This order cannot be cancelled." });

		const relativeTime = moment(time, "h:mm:ss a").fromNow();
		if (!(relativeTime.split(" ")[0] == "in"))
			return res
				.status(400)
				.send({ status: false, message: "This order cannot be cancelled." });

		const findBusiness = await Business.findOne({
			_id: findOrder.businessId,
		}).lean();

		for (show of findBusiness.shows[date]) {
			for (seat of findOrder.seats) {
				show.availableSeats[seat] = "Available";
			}
		}

		const updateBusiness = await Business.findByIdAndUpdate(
			findOrder.businessId,
			findBusiness
		);

		const deleteOrder = await Order.findOneAndUpdate(
			{ _id: req.body.orderId, isDeleted: false },
			{ status: "Cancelled" },
			{ new: true }
		);
		res
			.status(200)
			.send({ status: true, message: "Order cancelled successfully" });
	} catch (error) {
		res.status(500).send({ status: false, message: error.message });
	}
};

module.exports = { createOrder, getOrder, cancelOrder };
