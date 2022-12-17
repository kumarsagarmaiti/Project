const Fields = require("../models/fields");
const Region = require("../models/regions");
const validate = require("../validator/validators");
const latLongRegex = /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,10})?$/;

const createFields = async function (req, res) {
	try {
		const { name, parentId, parentName, latitude, longitude } = req.body;
		if (!Object.keys(req.body).length)
			return res
				.status(400)
				.send({ status: false, message: "Please provide property details" });

		const mandatoryFields = [
			"name",
			"parentId",
			"parentName",
			"longitude",
			"latitude",
		];
		for (let field of mandatoryFields) {
			if (!req.body[field])
				return res
					.status(400)
					.send({ status: false, message: `Please provide ${field}` });
			if (field == "longitude" || field == "latitude") continue;
			if (field == "parentId") {
				if (!validate.isValidObjectId(req.body["parentId"]))
					return res.status(400).send({
						status: false,
						message: "Please provide a valid objectId: parentId",
					});
				continue;
			}
			if (!validate.isValid(req.body[field]))
				return res
					.status(400)
					.send({ status: false, message: `Please provide a valid ${field}` });
		}
		if (!latLongRegex.test(latitude) || !latLongRegex.test(longitude))
			return res
				.status(400)
				.send({
					status: false,
					message: "Invalid or incorrect, latitude or longitude",
				});

		const isRegPresent = await Region.findOne({
			name: parentName,
			_id: parentId,
		});
		if (!isRegPresent)
			return res.status(404).send({
				status: false,
				message: "Parent Region not found with the given details",
			});
		req.body.userId = req.userId;

		const createFields = await Properties.create(req.body);
		const updateRegion = await Region.findByIdAndUpdate(parentId, {
			$push: { name: name, child: createFields._id },
		});

		return res.status(201).send({
			status: true,
			message: "Property created successfully",
			data: createFields,
		});
	} catch (error) {
		res.status(500).send(error.message);
	}
};
