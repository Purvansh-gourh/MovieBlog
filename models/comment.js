var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    lastUpdated: { type: Date, default: Date.now },
    text: String,
    rating: { type: Number, default: 0 }
});

module.exports = mongoose.model("Comment", commentSchema);
