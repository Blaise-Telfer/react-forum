const express = require("express");
const router = express.Router();
const Favorite = require("../models/favoriteModel");
const Post = require("../models/postModel");
const User = require("../models/userModel");


//add to the favorites list
router.post("/addToFavorite", (req, res) => {
    const {postId, postTitle, userFrom} = req.body;
    const newFavorite = new Favorite({
		postId,
		postTitle,
		userFrom
	});
    newFavorite.save()
	.then(newFavorite => {
        if(newFavorite){
            res.status(201).json({success: true, favorite: newFavorite});
        }
        else{
            res.status(400).json({success: false, errors: {global:"Failed to create fav"}});
        }
    })
});


//get number of what's already favorited
router.post("/favoriteNumber", (req, res) => {
    
	Favorite.find({ postId: req.body.postId })
	.exec((error, subscribe) => {
        if (error){
			return res.status(400).json({success: false, error})
		}else{
			res.status(200).json({ success: true, subscribeNumber: subscribe.length });
		}
    })
});


//check if the post is already favorited
router.post("/favorited", (req, res) => {
   
	Favorite.find({ postId: req.body.postId, userFrom: req.body.userFrom })
        .exec((error, subscribe) => {
            if (error){
				let result = false
				return res.status(400).json({success: false, error})
			}
			if (subscribe.length !== 0) {
                result = true
				return res.status(200).json({ success: true, subcribed: result })
            }
        })
});


//remove from the favorites list
router.post("/removeFromFavorite", (req, res) => { 
	
	Favorite.findOneAndDelete({ postId: req.body.postId, userFrom: req.body.userFrom })
    .exec((error, favorite) => {
        if (error){
			return res.status(400).json({ success: false, error });
		}
		else{
			res.status(200).json({ success: true, favorite })
		}
    })
});


//fetch posts you've favorited
router.get("/getFavoritedPost/:username", (req, res) => {
	
    Favorite.find({ userFrom: req.params.username })
	.then(favorite => {
		if(favorite){
			res.status(200).json({favorite})
		}
		else{
			res.status(404).json({errors:{global:"favorite not found"}});
		}
	})     
});



module.exports = router;
