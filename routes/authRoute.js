const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/db");
const passport = require("passport");
const crypto = require("crypto");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const validateRegisterInput = require("../controllers/validateRegister");
const validateLoginInput = require("../controllers/validateLogin");
const {validateEmail, validatePassword} = require("../controllers/validateOther");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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
      return res.status(400).json({ email: "Email already exists" });
  }
  user = await User.findOne({username: req.body.username});
  if (user) {
      return res.status(400).json({ username: "Username already exists" });
  }

	const newUser = new User({
		username: req.body.username,
		email: req.body.email,
		location: req.body.location,
		password: req.body.password,
		firstname: req.body.firstname,
		lastname: req.body.lastname
	});
	
	// Hash password before saving in database
    bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) { throw err };
          
		  const tomorrow = new Date();
		  tomorrow.setDate(tomorrow.getDate() + 1);
		  
		  newUser.password = hash;
		  const verificationToken = crypto.randomBytes(16).toString("hex");
		  newUser.auth = {token: verificationToken, isVerified: false, expires: tomorrow};
		  
		  const verificationMessage = {
			to: `${newUser.email}`,
			from: "blaisetelfer@gmail.com",
			subject: "SendGrid Message",
			html: `<h2>Hello ${newUser.username}, welcome to Teach Meet! Activate your account with our link below. </h2>` +
			`<a href="https://teachmeet.herokuapp.com/verify/${newUser.email}/${newUser.auth.token}"> Click Here To Log In! </a>`
		  };
          newUser.save()
            .then(user => {
				res.json(user);
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
router.post("/login", (req, res) => {
  
  //validation check
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
      return res.status(400).json({ emailnotfound: "Email not found" });
    }
	//if (!user.auth.isVerified) {
    //  return res.status(400).json({ notActivated: "Your account has not been activated. Check you email inbox." });
    //}
	
    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
		  username: user.username,
		  email: user.email,
		  role: user.role
        };
		
        // Sign token
        jwt.sign(payload, keys.token, { expiresIn: 43200 }, (err, token) => {
			res.json({success: true, token: "Bearer " + token});
		});
		} else {
			return res.status(400).json({ passwordincorrect: "Password incorrect" });
		}
    });
  });
});



//verify from the email
router.post("/verify", (req, res) => {
	
	const { email, token } = req.body;
	User.findOne({ email }).then(user => {
		
		if (!user) {
		  return res.status(400).json({ emailnotfound: "Email not found" });
		}
		if(token !== user.auth.token){
		  return res.status(400).json({ noToken: "Incorrect token" });
		}
		if(user.auth.isVerified){
		  return res.status(400).json({ alreadyUsed: "You have already used this link. Try logging in." });
		}
		if( new Date() > new Date(user.auth.expires) ){
		  return res.status(400).json({ linkExpired: "Your link has expired. Try logging in." });
		}
		
		const payload = {
		  id: user.id,
		  username: user.username,
		  email: user.email,
		  role: user.role
		};
		
		jwt.sign(payload, keys.token, { expiresIn: 43200 }, (err, token) => {
		  res.json({success: true, token: "Bearer " + token});
		});
		
		User.findOneAndUpdate({email: email},
		  {$set: {
			auth: { isVerified: true, token: token, expires: null }
		  }}
		).catch((error) => {console.log(error)});
		
	});
});


//display user info on account page
router.post('/forgot-password', (req,res) => {
    
	//check validation
	const { errors, isValid } = validateEmail(req.body);
	if (!isValid) {
	  return res.status(400).json(errors);
	}
	
	const { email, token } = req.body;
	User.findOne({ email }).then(user => {
		
		if (!user) {
		  return res.status(400).json({ emailnotfound: "Email not found" });
		}
		
		const newToken = crypto.randomBytes(16).toString("hex");
		const newExpire = moment().add(12, "hours");
		
		User.findOneAndUpdate({email: email},
		  {$set: {
			auth: {isVerified: true, resetToken: newToken, resetExpires: newExpire}
		  }}
		).catch((error) => {console.log(error)});
		
		user.save()
        .then(user => {
			res.json(user);
			const resetMessage = {
				to: `${user.email}`,
				from: "blaisetelfer@yahoo.com",
				subject: "SendGrid Message",
				html: `<h2>Hello ${user.username}, you have indicated that you want to reset your password. </h2>` +
				`<a href="https://teachmeet.herokuapp.com/reset-password/${user.email}/${newToken}"> Click Here To Reset Your Password! </a>`
			};
			sgMail.send(resetMessage)
				.catch((error) => {
					console.log(error);
				});
		})
		.catch(error => res.json(error));
	});
});



//display user info on account page
router.post('/reset-password', async (req,res) => {
    
	//check validation
	const { errors, isValid } = validatePassword(req.body);
	if (!isValid) {
	  return res.status(400).json(errors);
	}
	
	const { password, email, token } = req.body;
	User.findOne({ email }).then(user => {
		
		if(!user){
			return res.status(400).json({ noUser: "User not found" });
		}
		if(token !== user.auth.resetToken){
		  return res.status(400).json({ noToken: "Incorrect token" });
		}
		if(user.auth.resetToken == ""){
		  return res.status(400).json({ usedToken: "You already used this token" });
		}
		if(moment().utcOffset(0) > user.auth.resetExpires){
		  return res.status(400).json({ expired: "expired" });
		}
		
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(password, salt, (err, hash) => {
			  if (err) { throw err };
			  user.password = password;
			  user.password = hash;
			  user.auth.resetToken = "";
			  user.auth.resetExpires = moment().utcOffset(0);
			  user.save()
				.then(user => {
					res.json(user);
				})
				.catch(err => res.json(err));
			});
		});
	});
	
});


//delete account and their posts
router.post('/delete', (req,res) => {
	User.findOneAndRemove({ username: req.body.username }).then(() => {
		Post.deleteMany({ author: req.body.username }).then(() =>
            res.json({ success: true })
        );
	});
});


module.exports = router;