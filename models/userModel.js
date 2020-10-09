const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const Schema = mongoose.Schema;


const UserSchema = new Schema({
	
	firstname: {
		type: String,
		required: true,
	},
	lastname: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	location: {
		type: String,
		required: true,
		default: ""
	},
	role: {
		type: String,
		default: "user"
	},
	photo: {
		type: String,
		default: "https://aeealberta.org/wp-content/uploads/2018/10/profile.png"
	},
	resume: {
		type: String,
		default: ""
	},
	bio: {
		type: String,
		default: "",
		trim: true,
		maxlength: 250,
	},
	date: {
		type: Date,
		default: Date.now
	}
});


// 0c. Virtual property to get posts
UserSchema.virtual("posts", {
	ref: "Post",
	foreignField: "createdBy",
	localField: "_id",
});


module.exports = mongoose.model("User", UserSchema);