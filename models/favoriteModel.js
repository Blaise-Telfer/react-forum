const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const Schema = mongoose.Schema;


const favoriteSchema = mongoose.Schema({
    userFrom: {
		type: String
    },
    postId: {
		type: String
    },
    postTitle: {
		type: String
    },
    Post: {
		type: String
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("Favorite", favoriteSchema);
