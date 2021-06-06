const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/db");
const passport = require("passport");
const crypto = require("crypto");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const { isAuth, isAdmin } = require("../controllers/authParameters");
const validateRegisterInput = require("../controllers/validateRegister");
const validateLoginInput = require("../controllers/validateLogin");
const config = require("../config/db.js");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(config.SENDGRID_API);
const moment = require("moment");
moment().format(); 


//register handler
router.post("/register", async (req, res) => {
  //check validation
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  
  let user = await User.findOne({email: req.body.email});
  if (user) {
    return res.status(400).json({ message: "Email already exists" });
  }
  user = await User.findOne({username: req.body.username});
  if (user) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const newUser = new User({
	firstname: req.body.firstname,
	lastname: req.body.lastname,
	username: req.body.username,
	email: req.body.email,
	location: req.body.location,
	password: req.body.password
  });
	
  // Hash password before saving in database
  bcrypt.genSalt(10, (err, salt) => {
	bcrypt.hash(newUser.password, salt, (err, hash) => {
	  if (err) { throw err };
	  newUser.password = hash;
	  const verificationToken = crypto.randomBytes(16).toString("hex");
	  newUser.verifyToken.token = verificationToken;
	  const tokenExpire = moment().add(24, "hours");
	  newUser.verifyToken.expires = tokenExpire;
	  
	  const verificationMessage = {
		to: `${newUser.email}`,
		from: "",
		subject: "Verify Your Account",
		html: `<h2>Hello ${newUser.username}, welcome to our website! Activate your account with our link below. </h2>` +
		`<a href="http://localhost:3000/verify/${newUser.email}/${newUser.verifyToken.token}"> Click here to verify your account </a>`
	  };
	  
	  newUser.save().then(user => {
		res.json({ message: "You have registered successfully and can now log in" });
		sgMail.send(verificationMessage)
		.catch((error) => {
		  console.log(error);
		});
	  })
	  .catch(error => res.json(error));
	});
  });
});


//login handler
router.post("/login", async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  
  const email = req.body.email;
  const password = req.body.password;
  
  // Find user by email
  User.findOne({ email }).then(user => {
	// Check if user exists
	if (!user) {
      return res.status(400).json({ message: "Email not found" });
	}
	
	// Check password
	bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // Create JWT Payload
        const payload = {
          id: user.id,
		  username: user.username,
		  email: user.email,
		  role: user.role,
		  verified: user.verified,
		  verifyToken: user.verifyToken,
		  resetToken: user.resetToken
        };
		
        // Sign token, expires in 3hrs
        jwt.sign(payload, keys.JWT_SECRET, { expiresIn: 10800 }, (err, token) => {
		  res.json({success: true, token: "Bearer " + token});
		});
	  } else {
		return res.status(400).json({ message: "Password incorrect" });
	  }
	});
  });
});


//delete a user
router.delete("/:id", isAdmin, isAuth, async (req, res) => {
  try{
	const deletedUser = await User.findById(req.params.id);
	if (deletedUser) {
	  await deletedUser.remove();
	  Post.deleteMany({ author: req.body.username })
      return res.status(200).json({ message: "User Deleted" });
    }
  }
  catch (error){
	return res.status(400).json({ message: "Error in deleting user" });
  }
});


module.exports = router;
