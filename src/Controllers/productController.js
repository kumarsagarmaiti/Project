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

// -------------------------------------------- GET PRODUCTS ---------------------------------------------

exports.getProduct = async (req, res) => {
    try {
        let userQuery = req.query
        let checkquery = validate.anyObjectKeysEmpty(userQuery)
        if (checkquery) return res.status(400).send({ status: false, message: `${checkquery} can't be empty` });

        let filter = { isDeleted: false }

        let { size, name, priceGreaterThan, priceLessThan, priceSort } = userQuery


        //if no filter is provided
        if (Object.keys(userQuery).length == 0) {

            //.collation is used to check substrings --- locale : en = english lang and will neglect pronunciation of words
            const product = await productModel.find({ isDeleted: false }).sort({ price: priceSort }).collation({ locale: "en", strength: 1 }); //to make case insensitive Indexes
            if (product.length == 0) return res.status(404).send({ status: false, msg: "No product found" });
            return res.status(200).send({ status: true, message: 'Success', data: product })
        }

        // If filter is provided
        let keys = "size, name, priceGreaterThan, priceLessThan, priceSort"

        if (userQuery.size || userQuery.priceSort || userQuery.priceLessThan || userQuery.priceGreaterThan || userQuery.name) {

            if (Object.keys(userQuery).length > 0) {

                if (!validate.isValid(size)) {
                    const sizeArray = size.trim().split(",").map((s) => s.trim());
                    filter['availableSizes'] = { $in: sizeArray }
                }


                if (name) {
                    if (validate.isValid(name)) {
                        return res.status(400).send({ status: false, message: "Not a valid Name" })
                    }
                    const titleName = name.replace(/\s{2,}/g, ' ').trim()
                    filter['title'] = { $regex: titleName, $options: 'i' }  //options: 'i' to make case insensitive

                }
                                                
                if (priceGreaterThan) {
                    if (validate.isValid(priceGreaterThan) || !validate.isValidPrice(priceGreaterThan)) {
                        return res.status(400).send({ status: false, message: "Not a valid priceGreaterThan" })
                    }
                    filter['price'] = { $gt: priceGreaterThan }

                }
                if (priceLessThan) {
                    if (validate.isValid(priceLessThan) || !validate.isValidPrice(priceLessThan)) {
                        return res.status(400).send({ status: false, message: "Not a valid priceLessThan" })
                    }
                    filter['price'] = { $lt: priceLessThan }
                }

                if (priceGreaterThan && priceLessThan) {
                    filter['price'] = { $gt: priceGreaterThan, $lt: priceLessThan }
                }

                if (priceSort) {
                    if (!validate.isValid(priceSort)) {
                        if (!(priceSort == 1 || priceSort == -1))
                            return res.status(400).send({ status: false, message: "Price sort value should be 1 or -1 only" })
                    }
                }
            }

            
            let product = await productModel.find(filter).sort({ price: priceSort }).collation({ locale: "en", strength: 1 }); //collation query perform string comparisions without regard for case
            if (product.length === 0) return res.status(404).send({ status: false, message: "No products found" })
            return res.status(200).send({ status: true, message: 'Success', data: product })

        } else {
            return res.status(400).send({ status: false, message: `Cannot provide keys other than ${keys}` })
        }

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }


}
exports.getProductById = async (req, res) => {
	try {
        
        if (!validate.isValidObjectId(req.params.productId)) {
            return res.status(400).send({ status: false, message: "Please enter valid product id" })
		}
		let ValidProduct = await productModel.findById({ _id: req.params.productId })
        if (!ValidProduct) {
            return res.status(404).send({ status: false, message: "Product not available" })
        }
		if (ValidProduct.isDeleted == true) {
            return res.status(404).send({ status: true, message: "Product is deleted already" });
        }
		let totalProducts = await productModel.findOne({ _id: req.params.productId, isDeleted: false }).select({ deletedAt: 0 })
        return res.status(200).send({ status: true, message: "Success", data: totalProducts })
    }
	catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, msg: error.message })
    }
}



module.exports = { createProduct ,getProduct};
