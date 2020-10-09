const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
const passport = require("passport")
const key = require("../config/db")
const Post = require("../models/postModel");
const User = require("../models/userModel");
const validatePost = require("../controllers/postControl");

//create a new post
router.post("/create", (req, res) => {
	
	// Form validation
	const { errors, isValid } = validatePost(req.body);
	// Check validation
	if (!isValid) {
		return res.status(400).json(errors);
	}
  
	const {title, body, email, category, salary, city, author} = req.body;
	const newPost = new Post({
		title,
		body,
		email,
		category,
		salary,
		city,
		author
	});
    newPost.save()
        .then(newPost => {
            if(newPost){
                res.status(201).json({success: true, post: newPost});
            }
            else{
                res.status(400).json({errors: {global:"Failed to create post"}});
            }
        })
	
});


//display all posts on the "post page"
router.get('/', (req,res) => {
    
	Post.find()
	.then((data) => {
		let posts = [];
		data.map((item) => {
			posts.push({
				_id: item.id,
				title: item.title,
				author: item.author,
				createdBy: item.id,
				category: item.category,
				body: item.body,
				likes: item.Likes,
				email: item.email,
				salary: item.salary,
				city: item.city,
				date: item.date
			});
		});
	   res.status(200).json({posts});
    })
})


//get individual post
router.get('/:id', (req, res) => {
    
	Post.findOne({ _id: req.params.id })
		.populate({
			path: "createdBy",
			select: "email name Bookmarks",
		})
		.then(post => {
			if(post){
				res.status(200).json({post: post})
			}
			else{
				res.status(404).json({errors:{global:"post not found"}});
			}
		})
});

//get the posts for a specific category
router.get('/category/fullTime', (req, res)=>{
    
	Post.find({category: "fullTime"}).then(post => {
        if(post){
            res.status(200).json({post: post})
        }
        else{
            res.status(404).json({errors:{global:"post not found"}});
        }
    })
})
//get the posts for a specific category
router.get('/category/partTime', (req, res)=>{
    
	Post.find({category: "partTime"}).then(post => {
        if(post){
            res.status(200).json({post: post})
        }
        else{
            res.status(404).json({errors:{global:"post not found"}});
        }
    })
})



//delete individual post
router.post("/delete", (req, res) => {
	
	Post.findByIdAndRemove({_id: req.body.id})
	.then((deleted) => {
		return res.status(200).json({
            success: true,
            data: deleted,
            message: 'Post deleted.'
        });
	})
	.catch((error) => {
        return res.status(200).json({
            success: true,
            data: error
        });
    });
});


//edit a post
router.post("/update", (req, res) => {
	
	const {postId, userFrom, body} = req.body;
    Post.findOneAndUpdate(
		{ _id: postId },
        {
            $set: {
                body: body
            }
        }
	).then((edited) => {
        return res.status(200).json({
            success: true,
            data: edited,
            message: 'Post edited.'
        });
    }).catch((error) => {
        return res.status(200).json({
            success: true,
            data: error,
            message: 'Edit failed.'
        });
    });
});



module.exports = router;
