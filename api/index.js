import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose
	.connect(process.env.ConnectionString)
	.then(() => {
		console.log("successsfull connection to db");
	})
	.catch((err) => console.log(err));
const app = express();

app.listen(3000, () => {
	console.log("server is running on port 3000");
});
// app.get(test,(res,req)=>{})
