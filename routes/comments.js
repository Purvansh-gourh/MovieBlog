var express = require("express");
var router = express.Router({ mergeParams: true }),
    Comment = require("../models/comment"),
    middleWare = require("../middleware"),
    Movie = require("../models/movie");

// ---------------------------
//     get new comment
// ---------------------------
router.get("/new", middleWare.isLoggedIn, function (req, res) {
    //find movie by id
    Movie.findById(req.params.id, function (err, movie) {
        if (err) {
            req.flash("error", "Something went wrong");
            res.redirect("/movies");
        } else {
            res.render("comments/new", { movie: movie });
        }
    });
});

// ---------------------------
//     post new comment
// ---------------------------
router.post("/", middleWare.isLoggedIn, function (req, res) {
    Movie.findById(req.params.id, function (err, movie) {
        if (err) {
            req.flash("error", "Something went wrong");
            res.redirect("/movies");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    req.flash("error", "Something went wrong");
                    res.redirect("/movies");
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();

                    movie.comments.push(comment);
                    movie.save();

                    req.flash("success", "Comment added succesfully");
                    res.redirect("/movies/" + movie._id);
                }
            })
        }
    });
});

// ---------------------------
//     get edit comment
// ---------------------------
router.get("/:comment_id/edit", middleWare.isLoggedIn, middleWare.checkCommentOwner, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", { movieId: req.params.id, comment: foundComment });
        }
    });

});

// ---------------------------
//     post edit comment
// ---------------------------
router.put("/:comment_id", middleWare.isLoggedIn, middleWare.checkCommentOwner, function (req, res) {
    req.body.comment["lastUpdated"] = Date.now();
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,
        function (err, updatedComment) {
            if (err) {
                req.flash("error", "something went wrong");
                res.redirect("edit");
            } else {
                req.flash("success", "Comment edited succesfully");
                res.redirect("/movies/" + req.params.id);
            }
        }
    );
});

// ---------------------------
//     delete comment
// ---------------------------
router.delete("/:comment_id", middleWare.isLoggedIn, middleWare.checkCommentOwner, function (req, res) {

    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("/movies/" + req.params.id);
        } else {
            req.flash("success", "Comment  deleted succesfully");
            res.redirect("/movies/" + req.params.id);
        }
    });
});

module.exports = router;

