const Crops = require("../models/crops");
const validate = require("../validator/validators");

const createCropCycle = async function (req, res) {
	try {
		const isUserPresent = await Crops.findOne({ userId: req.userId });
		if (isUserPresent)
			return res.status(400).send({
				status: false,
				message:
					"Crop cycle details already present for the userId. Update details of crop cycle.",
			});

		const { months, season, crops } = req.body;
		if (!Object.keys(req.body).length)
			return res
				.status(400)
				.send({ status: false, message: "Please provide cropCycle details" });

		const mandatoryFields = ["months", "season", "crops"];
		for (let field of mandatoryFields) {
			if (!req.body[field] || !Array.isArray(req.body[field]))
				return res.status(400).send({
					status: false,
					message: `Please provide ${field} details in an array`,
				});
		}

		const monthNames = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];
		for (let month of months) {
			if (!monthNames.includes(month))
				return res.status(400).send({
					status: false,
					message: `months can only be among these: ${monthNames.join(", ")}`,
				});
		}

		const seasons = ["winter", "spring", "summer", "monsoon", "autumn"];
		for (let elem of season) {
			if (!seasons.includes(elem))
				return res.status(400).send({
					status: false,
					message: `season can only be among these: ${seasons.join(", ")}`,
				});
		}
		req.body.userId = req.userId;
		const createCropCycle = await Crops.create(req.body);
		return res.status(201).send({
			status: true,
			message: "Crop Cycle created successfully",
			data: createCropCycle,
		});
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const getCropCycle = async function (req, res) {
	try {
		const { cropCycleId } = req.body;
		if (!cropCycleId || !validate.isValidObjectId(cropCycleId))
			return res
				.status(400)
				.send({ status: false, message: "Please provide a valid cropCycleId" });

		const findCropCycle = await Crops.findById(cropCycleId);
		if (!findCropCycle)
			return res
				.status(404)
				.send({ status: false, message: "No cropCycle found" });
		else return res.status(200).send({ status: true, data: findCropCycle });
	} catch (error) {
		res.status(500).send(error.message);
	}
};

module.exports = { createCropCycle, getCropCycle };
