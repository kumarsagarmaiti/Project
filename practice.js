//Business owner model:
let businessData = {
	_id: "6162876abdcb70afeeaf9cf5",
	fname: "fname",
	lname: "lname",
	email: "email",
	phone: "phone",
	password: "password",
	GST: "GST",
	businessName: "bname",
	address: {
		state: "state",
		city: "city",
		pincode: 000000,
	},
	shows: [
		{
			movieId: "movieId",
			timings: [],
			date: [],
			availableSeats: [],
			ticketPrice: [{ royal: Number }],
		},
	],
};

let moviesData = {
	name: "",
	starring: [],
	ratings: "min1 max5",
};

let userData = {
	fname: "fname",
	lname: "lname",
	email: "email",
	phone: "phone",
	password: "password",
	address: {
		state: "state",
		city: "city",
		pincode: 000000,
	},
};

let cartData = {
	userId: "",
	seats: [
		{
			movieId: "",
			businessId: "",
			seats: [],
			time: "",
			date: "",
		},
	],
};

