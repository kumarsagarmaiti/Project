const Fields = require("../models/fields");
const Region = require("../models/regions");
const Owner = require("../models/owner");
const Property = require("../models/properties");
const validate = require("../validator/validators");
const ObjectId = require("mongoose").Types.ObjectId;
const latLongRegex = /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,10})?$/;

const createFields = async function (req, res) {
	try {
		const { parentId, latitude, longitude, cropCycleId, crops } = req.body;
		if (!Object.keys(req.body).length)
			return res
				.status(400)
				.send({ status: false, message: "Please provide field details" });

		const mandatoryFields = [
			"parentId",
			"longitude",
			"latitude",
			"cropCycleId",
			"crops",
		];
		for (let field of mandatoryFields) {
			if (!req.body[field])
				return res
					.status(400)
					.send({ status: false, message: `Please provide ${field}` });
		}
		const objectIds = ["parentId", "cropCycleId"];
		for (let id of objectIds) {
			if (!validate.isValidObjectId(req.body[id]))
				return res.status(400).send({
					status: false,
					message: `Please provide a valid objectId: ${id}`,
				});
		}
		if (!latLongRegex.test(latitude) || !latLongRegex.test(longitude))
			return res.status(400).send({
				status: false,
				message: "Invalid or incorrect, latitude or longitude",
			});

		if (!Array.isArray(crops))
			return res
				.status(400)
				.send({ status: false, message: "Crops should be in an array" });

		const isRegPresent = await Region.findOne({
			_id: parentId,
		});
		if (!isRegPresent)
			return res.status(404).send({
				status: false,
				message: "Parent Region not found with the given details",
			});

		req.body.ownerId = req.ownerDetails.ownerId;
		req.body.owner = req.ownerDetails.ownerName;
		req.body.parentName = isRegPresent.name;

		const createFields = await Fields.create(req.body);
		const updateOwner = await Owner.findByIdAndUpdate(req.body.ownerId, {
			$push: { fieldId: createFields._id },
		});
		const updateRegion = await Region.findByIdAndUpdate(parentId, {
			$push: { fields: { name: req.body.owner, child: createFields._id } },
		});

		const updateProperty = await Property.findOneAndUpdate(
			{
				regions: { $elemMatch: { child: ObjectId(parentId) } },
			},
			{
				$push: {
					cropCycle: { fieldId: createFields._id, cropCycleId: cropCycleId },
				},
			}
		);

		return res.status(201).send({
			status: true,
			message: "Property created successfully",
			data: createFields,
		});
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const getField = async function (req, res) {
	try {
		const { fieldId } = req.body;
		if (!fieldId || !validate.isValidObjectId(fieldId))
			return res
				.status(400)
				.send({ status: false, message: "Please provide a valid fieldId" });

		const findField = await Fields.findOne({
			_id: fieldId,
			isDeleted: false,
			ownerId: req.ownerDetails.ownerId,
		});
		if (!findField)
			return res.status(404).send({ status: false, message: "No field found" });
		else return res.status(200).send({ status: true, data: findField });
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const deleteField = async function (req, res) {
	try {
		const { fieldId } = req.body;
		if (!fieldId || !validate.isValidObjectId(fieldId))
			return res
				.status(400)
				.send({ status: false, message: "Please provide a valid fieldId" });
				
		const findField = await Fields.findOne({
			_id: fieldId,
			isDeleted: false,
			ownerId: req.ownerDetails.ownerId,
		});
		if (!findField)
			return res.status(404).send({ status: false, message: "No field found" });

		const deleteField = await Fields.findByIdAndUpdate(fieldId, {
			isDeleted: true,
			deletedAt: new Date(),
		});

		const updateRegion = await Region.findByIdAndUpdate(findField.parentId, {
			$pull: { fields: { child: ObjectId(findField._id) } },
		});
		const updateProperty = await Property.findOneAndUpdate(
			{
				cropCycle: { $elemMatch: { fieldId } },
			},
			{
				$pull: { cropCycle: { fieldId, cropCycleId: findField.cropCycleId } },
			}
		);
		return res
			.status(200)
			.send({ status: true, message: "Field deleted successfully" });
	} catch (error) {
		res.status(500).send(error.message);
	}
};

module.exports = { createFields, getField, deleteField };
