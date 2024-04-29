import e from "express";
import Listing from "../models/listingModel.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
	try {
		//console.log(req.parameter.id);
		console.log(req.user.id);

		const listing = await Listing.create({
			...req.body,
			userRef: req.user.id,
		});
		return res.status(201).json(listing);
	} catch (error) {
		next(error);
	}
};
export const deleteListing = async (req, res, next) => {
	console.log(req.params.id);
	const listing = await Listing.findById(req.params.id);

	console.log(listing);

	if (!listing) {
		return next(errorHandler(404, "Listing not found!"));
	}
	if (req.user.id !== listing.userRef) {
		return next(errorHandler(401, "You can only delete your own listings!"));
	}
	try {
		await Listing.findByIdAndDelete(req.params.id);
		res.status(200).json("Listing has been deleted!");
	} catch (error) {
		next(error);
	}
};
