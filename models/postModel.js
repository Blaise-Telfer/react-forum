const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const Schema = mongoose.Schema;


var postSchema = new Schema({
	title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
	author:{
        type:String,
        required:true
    },
	createdBy: {
		type: mongoose.Schema.ObjectId,
		ref: "User"
	},
    email: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}
);



module.exports = mongoose.model("Post", postSchema);
