var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    flash = require("connect-flash"),
    methodOverride = require("method-override"),
    // seedDB = require("./seeds"),
    passport = require("passport");

// -------------------------
//     connect routes
// -------------------------
var commentRoutes = require("./routes/comments"),
    movieRoutes = require("./routes/movies"),
    indexRoutes = require("./routes/index"),
    userRoutes = require("./routes/user");

// -------------------------
//     connect Database
// -------------------------
mongoose.connect("mongodb://localhost/movie_blog", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// -------------------------------------
//     Setup use and other requirements
// -------------------------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

// To disable browser caching
app.set('etag', false)
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    next()
})

// ----------------------------
//     PASSPORT CONFIGURATION
// ----------------------------
app.use(require("express-session")({
    secret: "Harry Potter is my favourite",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// require passport file for strategies
require("./configure/passport");

// ---------------------------
//    setup local variables
// ---------------------------
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// ------------------
//     USE ROUTES
// ------------------
app.use("/", indexRoutes);
app.use("/movies", movieRoutes);
app.use("/movies/:id/comments", commentRoutes);
app.use("/dashboard", userRoutes);


app.get('*', function (req, res) {
    res.render('pagenotfound');
});

app.listen(3000, function () {
    console.log("The Blog Server Has Started!");
});