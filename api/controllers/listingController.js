import Listing from "../models/listingModel.js";

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
