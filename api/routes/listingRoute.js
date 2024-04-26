import express from "express";
import {
	createListing,
	deleteListing,
} from "../controllers/listingController.js";
import { verifyToken } from "../utils/verifyUser.js";
const listingRouter = express.Router();

listingRouter.post("/create", verifyToken, createListing);
listingRouter.delete("/delete/:id", verifyToken, deleteListing);
export default listingRouter;
