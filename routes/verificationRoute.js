const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const keys = require("../config/db");
const User = require("../models/userModel");
const { validateEmail, validatePassword } = require("../controllers/validateOther");
const config = require("../config/db.js");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(config.SENDGRID_API);
const moment = require("moment");
moment().format();


//forgotten password request
router.post("/request/:email", async (req,res) => {
  const { errors, isValid } = validateEmail(req.params);
  if (!isValid) {
	return res.status(400).json(errors);
  }
  
  const { email } = req.params;
  User.findOne({ email }).then(user => {
	if (!user) {
	  return res.status(400).json({ message: "Email not found" });
	}
	//generate new token and expiration date
	const newToken = crypto.randomBytes(16).toString("hex");
	const newExpire = moment().add(1, "hour");
	
	User.findOneAndUpdate({ email },
	  {$set: {
		resetToken: {token: newToken, expires: newExpire}
	  }}
	).catch((error) => {res.json(error)});
	
	user.save()
	.then(user => {
	  const resetMessage = {
		to: `${user.email}`,
		from: "",
		subject: "Password Reset",
		html: `<h2>Hello ${user.username}, you have indicated that you want to reset your password. </h2>` +
		`<a href="http://localhost:3000/resetPassword/${user.email}/${newToken}"> Click here to reset your password; this link expires after one hour. </a>`
	  };
	  sgMail.send(resetMessage)
	  .catch((error) => {
		res.json(error);
	  });
	  return res.status(200).json({ message: "We sent a reset link to your email" });
	})
	.catch(error => res.json(error));
  });
});


//reset password
router.post("/reset-password", async (req, res) => {
  const { errors, isValid } = validatePassword(req.body);
  if (!isValid) {
	return res.status(400).json(errors);
  }
  
  const { password, email, token } = req.body;
  User.findOne({ email }).then(user => {
	if(!user){
	  return res.status(400).json({ message: "User not found" });
	}
	if(token !== user.resetToken.token){
	  return res.status(400).json({ message: "Incorrect token" });
	}
	if(user.resetToken.token == ""){
	  return res.status(400).json({ message: "You have already used this token" });
	}
	if(moment().utcOffset(0) > user.resetToken.expires){
	  return res.status(400).json({ message: "That token has expired" });
	}
	
	bcrypt.genSalt(10, (err, salt) => {
	  bcrypt.hash(password, salt, (err, hash) => {
		if (err) { throw err };
		user.password = hash;
		user.resetToken.token = "";
		user.resetToken.expires = moment().utcOffset(0);
		user.save()
		.then(user => {
		  res.status(200).json({ message: "Your password has been reset" });
		})
		.catch(err => res.status(400).json({ message: "There has been an error; please try again" }) );
	  });
	});
  });
});


//verify from the email
router.post("/", (req, res) => {
	const { email, token } = req.body;
	User.findOne({ email }).then(user => {
		
		if (!user) {
		  return res.status(400).json({ message: "Email not found" });
		}
		if(token !== user.verifyToken.token){
		  return res.status(400).json({ message: "Incorrect token" });
		}
		if(user.verified){
		  return res.status(400).json({ message: "You have already used this link. Try logging in." });
		}
		if(moment().utcOffset(0) > user.verifyToken.expires){
		  return res.status(400).json({ message: "Your link has expired. Try logging in." });
		}
		
		const payload = {
		  id: user.id,
		  username: user.username,
		  email: user.email,
		  role: user.role
		};
		
		// Sign token, expires in 3hrs
        jwt.sign(payload, keys.JWT_SECRET, { expiresIn: 10800 }, (err, token) => {
		  res.json({success: true, token: "Bearer " + token});
		});
		
		User.findOneAndUpdate({ email },
		  {$set: {
			verifyToken: { token: token, expires: null },
			verified: true
		  }}
		).catch((error) => {res.json(error)});
		return res.status(200).json({ message: "Your account has been verified." });
	});
});


module.exports = router;
