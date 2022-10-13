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
		const filtered = availableSizes.filter((x) => productEnumSizes.includes(x));
		if (availableSizes.length !== filtered.length)
			return res.status(400).send({
				status: false,
				message: `availableSizes can be only among these: ${productEnumSizes.join(
					", "
				)}`,
			});
		productData.availableSizes = JSON.parse(productData.availableSizes);

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

module.exports = { createProduct };
