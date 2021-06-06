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
	},
	verified: {
	  type: Boolean,
	  default: false
	},
	verifyToken: {
	  token: String,
	  expires: Date
	},
	resetToken: {
	  token: String,
	  expires: Date
	}
});


function validateEmail(input) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
  });

  return schema.validate(input);
}

function validatePassword(input) {
  const schema = Joi.object({
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(input);
}

module.exports = mongoose.model("User", UserSchema);