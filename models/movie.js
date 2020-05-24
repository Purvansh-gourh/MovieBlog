var mongoose = require("mongoose");

var movieSchema = new mongoose.Schema({
    name: String,
    image: String,
    review: String,
    imdb: String,
    rating: { type: Number, default: 0 },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    lastUpdated: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Movie", movieSchema);
