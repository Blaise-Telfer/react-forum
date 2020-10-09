const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/db");
const passport = require("passport");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const validateRegisterInput = require("../controllers/validateRegister");
const validateLoginInput = require("../controllers/validateLogin");


//cloudinary configuration 
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "",
  api_key: "",
  api_secret: ""
});


//multer configuration
const multer = require("multer");
const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
const imageFilter = function(req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|JPG|JPEG|png)$/i)) {
    return cb(new Error("Only image files are accepted!"), false);
  }
  cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter });

//PDF configuration
const pdfFilter = function(req, file, cb) {
  // accept word files only
  if (!file.originalname.match(/\.(pdf)$/i)) {
    return cb(new Error("Only text documents are accepted!"), false);
  }
  cb(null, true);
};
const uploadPDF = multer({ storage: storage, fileFilter: pdfFilter });


//register handler
router.post("/register", (req, res) => {
  
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  
  User.findOne({$or: [{email: req.body.email}, {username: req.body.username}] }).then(user => {
    if (user) {
      return res.status(400).json({ email: "User already exists" });
    }
	else {
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
		location: req.body.location,
        password: req.body.password,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		role: "user"
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});


//login handler
router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
	
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
        jwt.sign(
          payload,
          keys.token,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});


//display user info on account page
router.get('/user/:username', (req,res) => {
    
	User.findOne({username: req.params.username})
	.select("-password -confirmPassword")
	.then(user => {
		if(!user){
            res.status(404).json({errors:{global:'user does not exist'}})
        }
		else{
			res.status(200).json({user: user, status: "success"});
		}
	})
});




//display the user's posts on the user's account page
router.get('/:username', (req,res) => {
    User.findOne({username: req.params.username}).then(user => {
        if(!user){
            res.status(404).json({errors:{global:'user does not exist'}})
        }
        else{
            Post.find({author: req.params.username})
			.populate({
				path: "createdBy",
				select: "email username Bookmarks",
			})
			.then(post => {
				if(post){
					res.status(200).json({post: post})
				}
				else{
					res.status(404).json({errors:{global:"post not found"}});
				}
			})
        }
    })
});


//edit a profile
router.post("/update/info", (req, res) => {
	
	const {userFrom, firstname, lastname, city, bio} = req.body;
		User.findOneAndUpdate(
			{ username: userFrom },
			{
				$set: {
					firstname: firstname,
					lastname: lastname,
					location: city,
					bio: bio
				}
			}
		).then((edited) => {
			return res.status(200).json({success: true, message: 'User edited.'});
		}).catch((error) => {
			return res.status(400).json({success: false, message: 'Edit failed.'});
		});
});

//edit profile pic
router.post("/update/photo", upload.single("photo"), (req, res) => {
	
	cloudinary.v2.uploader.upload(req.file.path, function(err, result){
		if (err) {
		  req.json(err.message);
		}
		
		//url generated by Cloudinary
		const newPic = result.secure_url;
		const {userFrom, photo} = req.body;
		User.findOneAndUpdate(
			{ username: userFrom },
			{
				$set: {
					photo: newPic
				}
			}
		).then((edited) => {
			return res.status(200).json({success: true, message: 'User edited.'});
		}).catch((error) => {
			return res.status(400).json({success: false, message: 'Edit failed.'});
		});
    });
});


//edit resume
router.post("/update/resume", uploadPDF.single("resume"), (req, res) => {
	
	cloudinary.v2.uploader.upload(req.file.path, {flags: "attachment"}, function(err, result){
		if (err) {
		  console.log(err);
		}
		
		//url generated by Cloudinary
		const newResume = result.secure_url;
		const {userFrom, resume} = req.body;
		User.findOneAndUpdate(
			{ username: userFrom },
			{
				$set: {
					resume: newResume
				}
			}
		).then((edited) => {
			return res.status(200).json({success: true, message: 'User edited.'});
		}).catch((error) => {
			return res.status(400).json({success: false, message: 'Edit failed.'});
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


//display all users in the admin panel
router.get('/', (req,res) => {
    User.find()
	.then((data) => {
		let users = [];
		data.map((item) => {
			users.push({
				_id: item.id,
				email: item.email,
				username: item.username
			});
		});
	   res.status(200).json({users});
    })
});




module.exports = router;
