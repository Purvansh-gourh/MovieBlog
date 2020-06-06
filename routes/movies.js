var express = require("express");
var router = express.Router(),
    request = require("request"),
    Movie = require("../models/movie"),
    User = require("../models/user"),
    middleWare = require("../middleware");

// ----------------------
//    movies homepage
// ----------------------
router.get("/", function (req, res) {
    Movie.find({}, function (err, allMovies) {
        if (err || !allMovies) {
            req.flash("error", "Some error occured");
            res.redirect("/");

        } else {
            res.render("movies/index", { movies: allMovies });
        }
    });
});

// ----------------------
//    get new movie
// ----------------------
router.get("/new", middleWare.isLoggedIn, function (req, res) {
    res.render("movies/new");
});

// ----------------------
//    post new movie
// ----------------------
router.post("/", middleWare.isLoggedIn, function (req, res) {
    // req.body.movie.review = req.sanitize(req.body.movie.review);
    var newMovie = req.body.movie;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    newMovie.author = author;
    Movie.create(newMovie, function (err, movie) {
        if (err) {
            req.flash("error", "Something went wrong");
            res.redirect("back");
        } else {
            req.flash("success", "Movie entry added successfully");
            res.redirect("/movies");
        }
    });
});

// ----------------------
//    show movie
// ----------------------
router.get("/:id", function (req, res) {
    var myregexp = /^[0-9a-fA-F]{24}$/;
    if (req.params.id.match(myregexp)) {
        Movie.findById(req.params.id).populate("comments").exec(function (err, foundMovie) {
            if (err || !foundMovie) {
                req.flash("error", "Movie entry not found");
                res.redirect("/movies");
            } else {
                var finalMovie = foundMovie;

                //related movie searching
                var query = foundMovie.name;
                var result = query.split(' ', 2);
                query = "";
                result.forEach(function (ans) {
                    if (query.length < 7)
                        query += ans + ' ';
                });
                query = query.trim();
                var url = "http://www.omdbapi.com/?s=" + query + "&apikey=thewdb";

                var data, findcurr;

                request(url, function (error, response, answer) {

                    if (!error && response.statusCode == 200) {
                        data = JSON.parse(answer);
                    }
                    finalMovie["searchfor"] = data;

                    //details of this movie
                    url = "http://www.omdbapi.com/?i=" + foundMovie["imdb"] + "&plot=full&apikey=thewdb";
                    request(url, function (err, resp, ans) {
                        if (!err && resp.statusCode == 200) {
                            findcurr = JSON.parse(ans);
                        }
                        var likedby = undefined;
                        if (foundMovie.likes.length > 0) {
                            User.findById({ _id: foundMovie.likes[0] }, function (err, foundUser) {
                                if (err || !foundUser) {
                                    likedby = undefined;
                                } else {
                                    likedby = foundUser.username;
                                    res.render("movies/show", { movie: finalMovie, founded: findcurr, likedby: likedby });
                                }
                            });
                        } else {
                            res.render("movies/show", { movie: finalMovie, founded: findcurr, likedby: likedby });
                        }

                    });
                });
            }
        });
    } else {
        res.redirect('/pagenotfound');
    }
});

// ---------------------------
//    add movie from net
// ---------------------------
router.post("/new1", function (req, res) {
    var query = req.body.searchbyname.trim();
    var url = "http://www.omdbapi.com/?s=" + query + "&apikey=thewdb";
    request(url, function (error, response, answer) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(answer);
            data["searchedFor"] = query;
            res.render("movies/new1", { data: data });
        }
        else {
            req.flash("error", "Error finding movie online");
            res.redirect("back");
        }
    });
});


// ----------------------
//    like unlike movie
// ----------------------
router.post("/:id/like", middleWare.isLoggedIn, function (req, res) {
    var act = req.query.act;
    var userid = req.query.userid;
    Movie.findById(req.params.id, function (err, foundMovie) {
        if (err) {
            res.redirect("/movies/" + req.params.id);
        } else {
            // if(req.body.action)
            User.findById(userid, function (err, foundUser) {
                if (err) {
                    req.flash("error", "something went wrong");
                    res.redirect("/movies/" + req.params.id);
                } else {
                    var index = foundMovie.likes.indexOf(foundUser._id);
                    if (act == 1) {
                        if (index == -1)
                            foundMovie.likes.push(foundUser);
                        else
                            req.flash("error", "only 1 like permitted");
                    } else {
                        if (index == -1)
                            req.flash("error", "unlike without like prohibited");
                        else
                            foundMovie.likes.splice(index, 1);

                    }
                }
                foundMovie.save();
                res.redirect("/movies/" + req.params.id);
            });
        }
    });
});

// ----------------------
//    get edit movie
// ----------------------
router.get("/:id/edit", middleWare.isLoggedIn, middleWare.checkMovieOwner, function (req, res) {
    Movie.findById(req.params.id, function (err, foundMovie) {
        if (err || !foundMovie) {
            res.redirect("back");
        } else {
            res.render("movies/edit", { movie: foundMovie });
        }
    });
});

// ----------------------
//    post edit movie
// ----------------------
router.put("/:id", middleWare.isLoggedIn, middleWare.checkMovieOwner, function (req, res) {
    //find and update movie
    req.body.movie["lastUpdated"] = Date.now();

    Movie.findByIdAndUpdate(req.params.id, req.body.movie, function (err, updatedMovie) {
        if (err) {
            req.flash("error", "something went wrong");
            res.redirect("/movies");
        } else {
            req.flash("success", "Movie entry  edited succesfully");
            res.redirect("/movies/" + req.params.id);
        }
    })
})

// ----------------------
//    delete movie
// ----------------------
router.delete("/:id", middleWare.isLoggedIn, middleWare.checkMovieOwner, function (req, res) {
    Movie.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/movies");
        } else {
            req.flash("success", "Movie entry  deleted succesfully");
            res.redirect("/movies");
        }
    });
});

module.exports = router;