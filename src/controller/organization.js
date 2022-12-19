const Organization = require("../models/organization");
const validate = require("../validator/validators");

const createOrganization = async function (req, res) {
	try {
		let { name } = req.body;
		if (!name || !validate.isValid(name))
			return res
				.status(400)
				.send({ status: false, message: "Please enter a valid name" });

		req.body.userId = req.userId;

		const createOrganization = await Organization.create(req.body);
		return res.status(201).send({
			status: true,
			msg: "Organization created successfully",
			data: createOrganization,
		});
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const getOrganization = async function (req, res) {
	try {
		const { organizationId } = req.body;
		if (!organizationId || !validate.isValidObjectId(organizationId))
			return res.status(400).send({
				status: false,
				message: "Please provide a valid organizationId",
			});

		const findOrganization = await Organization.findById(organizationId);
		if (!findOrganization)
			return res
				.status(404)
				.send({ status: false, message: "No organization found" });
		else return res.status(200).send({ status: true, data: findOrganization });
	} catch (error) {
		res.status(500).send(error.message);
	}
};

module.exports = { createOrganization, getOrganization };
