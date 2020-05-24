var Movie = require("../models/movie"),
    Comment = require("../models/comment");
var miiddlewareObj = {};
miiddlewareObj.checkCommentOwner = function (req, res, next) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err || !foundComment) {
            req.flash('error', 'Sorry, that comment does not exist!');
            res.redirect("/movies");
        } else {
            if (foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash('error', 'You don\'t have permission to do that!');
                res.redirect('/movies/' + req.params.id);
            }
        }
    });

};
miiddlewareObj.checkMovieOwner = function (req, res, next) {
    Movie.findById(req.params.id, function (err, foundMovie) {
        if (err || !foundMovie) {
            req.flash("error", "Movie not found");
            res.redirect("/movies");
        } else {
            if (foundMovie.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that !");
                res.redirect('/movies/' + req.params.id);
            }
        }
    });
};

miiddlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Login required !!");
    res.redirect("/login");
}

module.exports = miiddlewareObj;
