var express = require("express");
var router = express.Router(),
    middleWare = require("../middleware"),
    Movie = require("../models/movie"),
    User = require("../models/user");

// ----------------------
//    get dashboard
// ----------------------
router.get("/", middleWare.isLoggedIn, function (req, res) {
    Movie.find({ "author.id": req.user._id }, function (err, allMovie) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/");
        } else {
            var likes = [], labeldata = [], movieID = [];
            allMovie.forEach(function (movie) {
                var index = movie.name.indexOf("\'");
                if (index != -1) {
                    movie.name = [movie.name.slice(0, index), movie.name.slice(index + 1)].join('');
                }
                index = movie.name.indexOf("\"");
                if (index != -1) {
                    movie.name = [movie.name.slice(0, index), movie.name.slice(index + 1)].join('');
                }
                labeldata.push(movie.name);
                likes.push(movie.likes.length);
                movieID.push(movie._id);
            });
            res.render("user/dashboard", { labeldata: JSON.stringify(labeldata), likes: JSON.stringify(likes), movieID: movieID });
        }
    });
});

// ----------------------
//    get edit profile
// ----------------------
router.get("/edit", middleWare.isLoggedIn, function (req, res) {
    res.render("user/edit")
});

// ----------------------
//    post edit profile
// ----------------------
router.put("/", middleWare.isLoggedIn, function (req, res) {
    User.findOne({ email: req.body.user.email }, function (err, current) {
        if (err) {
            res.redirect("/dashboard/edit");
        } else {
            if (current && current._id != req.query.id) {
                req.flash("error", "email already registered ..enter different email");
                res.redirect("/dashboard/edit");
            } else {
                User.findById(req.user._id, function (err, foundUser) {
                    if (err || !foundUser) {
                        req.flash("error", err.message);
                        res.redirect("/dashboard/edit");
                    } else {
                        var newuser = req.body.user;
                        foundUser.username = newuser.username;
                        foundUser.fullName = newuser.fullName;
                        foundUser.email = newuser.email;
                        req.flash("success", "details updated succesfully");
                        if (foundUser.google.email && foundUser.email !== foundUser.google.email) {
                            req.flash("error", "email updated google link removed...");
                            foundUser.google = undefined;
                        }
                        if (foundUser.facebook.email && foundUser.email !== foundUser.facebook.email) {
                            req.flash("error", "email updated google link removed...");
                            foundUser.facebook = undefined;
                        }
                        if (newuser.oldpassword !== newuser.newpassword) {
                            foundUser.changePassword(newuser.oldpassword, newuser.newpassword, function (err) {
                                if (err) {
                                    req.flash("error", err.message);
                                    res.redirect("/dashboard/edit");
                                } else {
                                    foundUser.save();
                                    req.flash("success", "password changed succesfully");
                                    res.redirect("/dashboard");
                                }
                            });
                        } else {
                            foundUser.save();
                            res.redirect("/dashboard");
                        }
                    }
                });
            }
        }
    });

});

// ----------------------
//    delete profile
// ----------------------
router.delete("/", middleWare.isLoggedIn, function (req, res) {
    User.findByIdAndRemove(req.user._id, function (err) {
        if (err) {
            req.flash("error", "something went wrong");
            res.redirect("/dashboard");
        } else {
            Movie.deleteMany({ 'author.id': req.user._id }, function (err) {
                if (err) {
                    req.flash("error", "something went wrong");
                    res.redirect("/dashboard");
                } else {
                    req.flash("success", "account and related post deleted successfully");
                    res.redirect("/movies");
                }
            });
        }
    });
});

module.exports = router;