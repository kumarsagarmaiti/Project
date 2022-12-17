const Properties = require("../models/properties");
const Organization = require("../models/organization");
const validate = require("../validator/validators");

const createProperties = async function (req, res) {
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
		const isOrgPresent = await Organization.findOne({
			name: parentName,
			_id: parentId,
		});
		if (!isOrgPresent)
			return res
				.status(404)
				.send({
					status: false,
					message: "Parent Organization not found with the given details",
				});
		req.body.userId = req.userId;

		const createProperties = await Properties.create(req.body);
		const updateOrganization = await Organization.findByIdAndUpdate(parentId, {
			$push: { name: name, child: createProperties._id },
		});

		return res
			.status(201)
			.send({
				status: true,
				message: "Property created successfully",
				data: createProperties,
			});
	} catch (error) {
		res.status(500).send(error.message);
	}
};
