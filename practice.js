const moment = require("moment");
// // let obj1 = { A: 10, B: 15,C:5,D:8,E:10 };
// // let obj2 = {};
// // for (key in obj1) {
// // 	for (i = 1; i <= obj1[key]; i++) {
// // 		obj2[`${key}${i}`] = "Available";
// // 	}
// // }
// // const allSeats = [];
// // allSeats.push(obj2);
// // // console.log(obj2);

// // const bookSeats = ["A1", "A2", "B1", 'B10',"E11","C9"];
// // for (seat of bookSeats) {
// //   if(!allSeats[0][seat]) console.log("Seat Not Present for "+ seat);

// // 	allSeats[0][seat] = "Unavailable";
// // }

// // const availableSeats = [];
// // for (key in allSeats[0]) {
// // 	if (allSeats[0][key] === "Available") availableSeats.push(key);
// // }
// // console.log(availableSeats);
console.log(moment("12:01 PM", "LT", true).isValid());

const data = [
	{
		date: {
			movieId: { type: ObjectId, ref: "Movies", required: true },
			timings: { type: String, required: true },
			screen: Number,
			availableSeats: [],
			ticketPrice: [],
		},
	},
];
