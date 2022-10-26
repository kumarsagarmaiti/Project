const Order = require("../Models/ordermodel");
const Cart = require("../Models/cartmodel");
const Business = require("../Models/businessmodel");

const createOrder = async function (req, res) {
	try {
		const userId = req.params.userId;
		const { cartId, businessId } = req.body;
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
		const deleteOrder = await Order.findOneAndUpdate(
			{ _id: req.body.orderId, isDeleted: false },
			{ status: "Cancelled" }
		);
		res
			.status(200)
			.send({ status: true, message: "Order cancelled successfully" });
	} catch (error) {
		res.status(500).send({ status: false, message: error.message });
	}
};

module.exports = { createOrder, getOrder, cancelOrder };
