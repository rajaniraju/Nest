import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRoute.js";
import authRouter from "./routes/authRoute.js";
dotenv.config();

mongoose
	.connect(process.env.ConnectionString)
	.then(() => {
		console.log("successsfull connection to db");
	})
	.catch((err) => console.log(err));
const app = express();
app.use(express.json());
app.listen(3000, () => {
	console.log("server is running on port 3000");
});
/*app.get("/test", (req, res) => {
    res.json({
        "todays date is ": Date(),
        message: "get me a cup of cofee!"    });
});*/
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);      

app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Internal Server Error";
	return res.status(statusCode).json({
		success: false,
		statusCode,
		message,
	});
});
