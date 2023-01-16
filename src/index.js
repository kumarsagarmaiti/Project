const express = require("express");
const bodyParser = require("body-parser");
const route = require("./routes/route.js");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

const corsOptions = {
	origin: "http://localhost:3000",
};
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

mongoose
	.connect(
		"mongodb+srv://kumarsagar_functionup:CjDCkJbsxcpkMf5N@cluster0.fnt89sj.mongodb.net/albanero",
		{
			useNewUrlParser: true,
		}
	)
	.then(() => console.log("MongoDB is connected"))
	.catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.port || 3001, function () {
	console.log("Express app running on port" + (process.env.port || 3001));
});
