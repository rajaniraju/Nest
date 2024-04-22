import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
			default:
				"https://www.google.com/imgres?imgurl=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F009%2F749%2F643%2Fnon_2x%2Fwoman-profile-mascot-illustration-female-avatar-character-icon-cartoon-girl-head-face-business-user-logo-free-vector.jpg&tbnid=scOO1w3wglqxvM&vet=12ahUKEwiyqt32-s6FAxU6yMkDHfP5DkAQMygOegUIARCSAQ..i&imgrefurl=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fprofile-picture&docid=mcHMuvcXeszZoM&w=980&h=980&q=images%20for%20profile&ved=2ahUKEwiyqt32-s6FAxU6yMkDHfP5DkAQMygOegUIARCSAQ",
		},
	},
	{ timestamps: true }
);
const User = mongoose.model("User", userSchema);
export default User;
