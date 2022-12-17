const Regions = require("../models/regions");
const Properties = require("../models/properties");
const validate = require("../validator/validators");

const createRegions = async function (req, res) {
	try {
		const { name, parentId, parentName } = req.body;
		if (!Object.keys(req.body).length)
			return res
				.status(400)
				.send({ status: false, message: "Please provide property details" });

		const mandatoryFields = ["name", "parentId", "parentName"];
		for (let field of mandatoryFields) {
			if (!req.body[field])
				return res
					.status(400)
					.send({ status: false, message: `Please provide ${field}` });
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
		req.body.userId = req.userId;

		const isPropPresent = await Properties.findOne({
			name: parentName,
			_id: parentId,
		});
		const isRegPresent = await Regions.findOne({
			name: parentName,
			_id: parentId,
		});

		if (!isPropPresent && !isRegPresent)
			return res.status(404).send({
				status: false,
				message: "No parent property or region found with the given details",
			});

		const createRegions = await Regions.create(req.body);
		if (isPropPresent) {
			const updateProperty = await Properties.findByIdAndUpdate(parentId, {
				$push: { name: name, child: createProperties._id },
			});
		} else {
			const updateRegion = await Regions.findByIdAndUpdate(parentId, {
				$push: { name: name, child: createProperties._id },
			});
		}

		return res.status(201).send({
			status: true,
			message: "Region created successfully",
			data: createRegions,
		});
	} catch (error) {
		res.status(500).send(error.message);
	}
};

module.exports = { createRegions };
