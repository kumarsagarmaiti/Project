const Product = require("../Models/productModel");
const validate = require("../Utility/validator");
const aws = require("../MIddleware/aws");
const reg = new RegExp("^[0-9]+$");

const createProduct = async function (req, res) {
	try {
		const productData = req.body;
		const productImage = req.files;

		if (!validate.isValidInputBody(productData))
			return res
				.status(400)
				.send({ status: false, message: "Please provide product details" });

		if (productImage.length === 0)
			return res
				.status(400)
				.send({ status: false, message: "Please provide productImage" });

		const fileTypes = ["image/png", "image/jpeg"];
		if (validate.acceptFileType(productImage, fileTypes))
			return res.status(400).send({
				status: false,
				message: `Invalid profileImage type. Please upload a jpg, jpeg or png file.`,
			});

		const mandatoryFields = ["title", "description", "availableSizes"];
		for (field of mandatoryFields) {
			if (!productData[field])
				return res
					.status(400)
					.send({ status: false, message: `Please provide ${field}` });
			if (!validate.isValid(productData[field]))
				return res
					.status(400)
					.send({ status: false, message: `Please provide a valid ${field}` });
		}

		if (!productData.price || productData.price.trim().length === 0) {
			return res
				.status(400)
				.send({ status: false, message: "Please provide product price" });
		} else if (!reg.test(productData.price)) {
			return res
				.status(400)
				.send({ status: false, message: "Invalid price format" });
		} else {
			productData.price = Number(productData.price);
		}

		if (
			!productData.availableSizes ||
			productData.availableSizes.trim().length === 0 ||
			typeof JSON.parse(productData.availableSizes) !== "object"
		)
			return res.status(400).send({
				status: false,
				message: "Please provide available sizes in an array",
			});

		const availableSizes = JSON.parse(productData.availableSizes);
		const productEnumSizes = ["S", "XS", "M", "X", "L", "XXL", "XL"];
		for (sizes of availableSizes) {
			if (!productEnumSizes.includes(sizes))
				return res.status(400).send({
					status: false,
					message: `availableSizes can be only among these: ${productEnumSizes.join(
						", "
					)}`,
				});
		}
		productData.availableSizes = availableSizes;

		if (productData.currencyId) {
			if (!validate.isValid(productData.currencyId))
				return res.status(400).send({
					status: false,
					message: `Please provide a valid currencyId`,
				});
			if (productData.currencyId != "INR")
				return res.status(400).send({
					status: false,
					message: "currencyId should be INR",
				});
		}

		if (productData.currencyFormat) {
			if (!validate.isValid(productData.currencyFormat))
				return res.status(400).send({
					status: false,
					message: `Please provide a valid currencyFormat`,
				});
			if (productData.currencyFormat != "₹")
				return res.status(400).send({
					status: false,
					message: "currencyFormat should be ₹",
				});
		}

		if (productData.installments) {
			if (
				!reg.test(productData.installments) ||
				productData.installments.trim().length === 0
			)
				return res
					.status(400)
					.send({ status: false, message: "Installments should be a number" });
			else productData.installments = Number(productData.installments);
		}

		if (productData.isFreeShipping) {
			if (
				productData.isFreeShipping != true ||
				productData.isFreeShipping != false
			)
				return res.status(400).send({
					status: false,
					message: "Please give a true or false value",
				});
			if (productData.isFreeShipping == true) productData.isFreeShipping = true;
			if (productData.isFreeShipping == false)
				productData.isFreeShipping = false;
		}

		const isUniqueTitle = await Product.findOne({ title: productData.title });
		if (isUniqueTitle)
			return res
				.status(400)
				.send({ status: false, message: "Title already present" });

		productData.productImage = await aws.uploadFile(productImage[0]);

		const createProduct = await Product.create(productData);
		res.status(201).send({
			status: true,
			message: "Product registered successfully",
			data: createProduct,
		});
	} catch (error) {
		res.status(500).send({ status: false, message: error.message });
	}
};

const updateProduct = async function (req, res) {
	try {
		const productId = req.params.productId;
		const productData = req.body;
		const productImage = req.files;

		if (!validate.isValidObjectId(productId))
			return res
				.status(400)
				.send({ status: false, message: "Invalid productId" });

		if (!validate.isValidInputBody(productData))
			return res
				.status(400)
				.send({ status: false, message: "Please provide product details" });

		const presentProduct = await Product.findOne({
			_id: productId,
			isDeleted: false,
		});
		if (!presentProduct)
			return res
				.status(404)
				.send({ status: false, message: "No product found" });

		const updationFields = Object.keys(productData).filter(
			(x) => x != "price" && x != "isFreeShipping" && x != "installments"
		);
		for (field of updationFields) {
			if (!productData[field])
				return res
					.status(400)
					.send({ status: false, message: `Please provide ${field}` });
			if (!validate.isValid(productData[field]))
				return res
					.status(400)
					.send({ status: false, message: `Please provide a valid ${field}` });
		}

		const numberFields = ["price", "installments"];
		for (field of numberFields) {
			if (productData[field]) {
				if (!validate.isValid(productData[field]))
					return res.status(400).send({
						status: false,
						message: `Please provide a valid ${field}`,
					});
				if (!reg.test(productData[field])) {
					return res
						.status(400)
						.send({ status: false, message: `Invalid ${field} format` });
				}
				productData[field] = Number(productData[field]);
			}
		}

		if (productData.isFreeShipping) {
			if (
				productData.isFreeShipping != true ||
				productData.isFreeShipping != false
			)
				return res.status(400).send({
					status: false,
					message: "Please give a true or false value",
				});
			if (productData.isFreeShipping == true) productData.isFreeShipping = true;
			if (productData.isFreeShipping == false)
				productData.isFreeShipping = false;
		}

		if (productData.availableSizes) {
			if (typeof JSON.parse(productData.availableSizes) !== "object")
				return res.status(400).send({
					status: false,
					message: "Please provide available sizes in an array",
				});

			let availableSizes = JSON.parse(productData.availableSizes);
			const productEnumSizes = ["S", "XS", "M", "X", "L", "XXL", "XL"];
			for (sizes of availableSizes) {
				if (!productEnumSizes.includes(sizes))
					return res.status(400).send({
						status: false,
						message: `availableSizes can be only among these: ${productEnumSizes.join(
							", "
						)}`,
					});
			}
			availableSizes = availableSizes.filter(
				(x) => !presentProduct.availableSizes.includes(x)
			);
			productData.availableSizes = availableSizes;
		}

		if (productData.currencyId) {
			if (!validate.isValid(productData.currencyId))
				return res.status(400).send({
					status: false,
					message: `Please provide a valid currencyId`,
				});
			if (productData.currencyId != "INR")
				return res.status(400).send({
					status: false,
					message: "currencyId should be INR",
				});
		}

		if (productData.currencyFormat) {
			if (!validate.isValid(productData.currencyFormat))
				return res.status(400).send({
					status: false,
					message: `Please provide a valid currencyFormat`,
				});
			if (productData.currencyFormat != "₹")
				return res.status(400).send({
					status: false,
					message: "currencyFormat should be ₹",
				});
		}

		if (productData.title) {
			const titlePresent = await Product.findOne({ title: productData.title });
			if (titlePresent)
				return res
					.status(400)
					.send({ status: false, message: "Title already present" });
		}
		if (productImage.length > 0) {
			const fileTypes = ["image/png", "image/jpeg"];
			if (validate.acceptFileType(productImage, fileTypes))
				return res.status(400).send({
					status: false,
					message: `Invalid profileImage type. Please upload a jpg, jpeg or png file.`,
				});
			productData.productImage = await aws.uploadFile(productImage[0]);
		}

		const updateProduct = await Product.findByIdAndUpdate(
			productId,
			productData,
			{ new: true }
		);

		return res
			.status(200)
			.send({ status: true, message: "Success", data: updateProduct });
	} catch (error) {
		res.status(500).send({ status: false, message: error.message });
	}
};

module.exports = { createProduct, updateProduct };
