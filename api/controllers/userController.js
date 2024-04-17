export const test = (req, res) => {
	res.json({
		"todays date is ": Date(),
		message: "get me a cup of cofee!",
	});
};
