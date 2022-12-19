const Properties = require("../models/properties");
const Organization = require("../models/organization");
const validate = require("../validator/validators");

const createProperties = async function (req, res) {
	try {
		const { name, parentId } = req.body;
		if (!Object.keys(req.body).length)
			return res
				.status(400)
				.send({ status: false, message: "Please provide property details" });

		const mandatoryFields = ["name", "parentId"];
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

		const isOrgPresent = await Organization.findOne({
			_id: parentId,
		});
		if (!isOrgPresent)
			return res.status(404).send({
				status: false,
				message: "Parent Organization not found with the given details",
			});
		req.body.userId = req.userId;
		req.body.parentName = isOrgPresent.name;

		const createProperties = await Properties.create(req.body);
		const updateOrganization = await Organization.findByIdAndUpdate(parentId, {
			$push: { properties: { name: name, child: createProperties._id } },
		});

		return res.status(201).send({
			status: true,
			message: "Property created successfully",
			data: createProperties,
		});
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const getProperty = async function (req, res) {
	try {
		const { propertyId } = req.body;
		if (!propertyId || !validate.isValidObjectId(propertyId))
			return res
				.status(400)
				.send({ status: false, message: "Please provide a valid propertyId" });

		const findProperty = await Properties.findOne({
			userId: req.userId,
			_id: propertyId,
			isDeleted: false,
		});
		if (!findProperty)
			return res
				.status(404)
				.send({ status: false, message: "No property found" });
		else return res.status(200).send({ status: true, data: findProperty });
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const deleteProperty = async function (req, res) {
	try {
		const { propertyId } = req.body;
		if (!propertyId || !validate.isValidObjectId(propertyId))
			return res
				.status(400)
				.send({ status: false, message: "Please provide a valid propertyId" });

		const findProperty = await Properties.findOne({
			userId: req.userId,
			_id: propertyId,
			isDeleted: false,
		});
		if (!findProperty)
			return res
				.status(404)
				.send({ status: false, message: "No property found" });

		const deleteProperty = await Properties.findByIdAndUpdate(propertyId, {
			isDeleted: true,
			deletedAt: new Date(),
		});

		const updateOrganization = await Organization.findByIdAndUpdate(
			findProperty.parentId,
			{
				$pull: {
					properties: { name: findProperty.name, child: findProperty._id },
				},
			}
		);

		return res
			.status(200)
			.send({ status: true, message: "Property deleted successfully" });
	} catch (error) {
		res.status(500).send(error.message);
	}
};

module.exports = { createProperties, getProperty, deleteProperty };
