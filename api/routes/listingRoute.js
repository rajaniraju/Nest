import express from "express";
import { createListing } from "../controllers/listingController";
import { verifyToken } from "../utils/verifyUser";
const listingRouter = express.Router();

listingRouter.post("/create", verifyToken, createListing);
