var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    nodemailer = require('nodemailer'),
    sha256 = require('crypto-js/sha256'),
    // config = require("../configure/configure"),
    User = require("../models/user");


// -------------------
//    landing page
// -------------------
router.get("/", function (req, res) {
    res.render("landing");
});

// ----------------------
//    get user register
// ----------------------
router.get("/register", function (req, res) {
    if (req.isAuthenticated())
        res.redirect('/dashboard');
    else
        res.render("register");
});

// ----------------------
//    post user register
// ----------------------
router.post("/register", function (req, res) {
    var newUser = new User({
        fullName: req.body.fullname,
        email: req.body.email,
        username: req.body.username
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function () {
                req.flash("success", "Welcome to MovieBlog " + user.username);
                res.redirect("/movies");
            });
        }
    });
});

// ----------------------
//    get user login
// ----------------------
router.get("/login", function (req, res) {
    if (req.isAuthenticated())
        res.redirect('/dashboard');
    else
        res.render("login");
});

// ----------------------
//    post user login
// ----------------------
router.post("/login", passport.authenticate("local",
    {
        successReturnToOrRedirect: "/dashboard",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Logged In successfully'
    }), function (req, res) {
    }
);

// ----------------------
//    get user logout
// ----------------------
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Logged Out successfully");
    res.redirect("/movies");
})

// ----------------------
//    GOOGLE STRATEGY
// ----------------------
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// the callback after google has authenticated the user
router.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/dashboard',
        failureRedirect: '/movies',
        failureFlash: true,
        successFlash: 'Logged In successfully'
    })
);

// ----------------------
//   FACEBOOK STRATEGY
// ----------------------
router.get('/auth/facebook', passport.authenticate('facebook'));

// the callback after facebook has authenticated the user
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/dashboard',
        failureRedirect: '/movies',
        failureFlash: true,
        successFlash: 'Logged In successfully'
    }));

// ----------------------
//  get forgot password
// ----------------------
router.get('/forgot', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/dashboard');
    } else {
        res.render('user/resetPassword');
    }
});

// ----------------------
//  post forgot password
// ----------------------
var transporter = nodemailer.createTransport(
    {
        service: process.env.ADMINMAIL_SERVICE,
        auth: {
            user: process.env.ADMINMAIL_AUTH_USER,
            pass: process.env.ADMINMAIL_AUTH_PASS
        }
    }
);

router.post('/forgot', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/dashboard');
    } else {
        User.findOne({ email: req.body.email }, function (err, foundUser) {
            if (err || !foundUser) {
                req.flash("error", "Couldn't find user with that email");
                res.redirect('/forgot');
            } else {
                const token = sha256(foundUser.email + sha256("Harry Potter"));
                foundUser.resetToken = token;
                foundUser.resetExpire = Date.now() + 300000;
                foundUser.save();
                const mailOptions = {
                    to: foundUser.email,
                    from: process.env.ADMINMAIL_AUTH_USER,
                    subject: 'MovieBlog Password Reset',
                    text: `
You are receiving this because you (or someone else) have requested the reset of the password for your account.
Please click on the following link, or paste this into your browser to complete the process:
http://localhost:3000/reset/${token}
If you did not request this, please ignore this email and your password will remain unchanged.
This link will expire after 5 minutes .
                    `,
                };
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        req.flash("error", "Something went wrong");
                        res.redirect("/forgot");
                    } else {
                        req.flash("success", "reset link has been sent to your email");
                        res.redirect("/movies");
                    }
                });
            }
        });
    }
});

// ----------------------
//  get change password
// ----------------------
router.get('/reset/:token', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/dashboard');
    } else {
        User.findOne({ resetToken: req.params.token }, function (err, foundUser) {
            if (err || !foundUser) {
                req.flash("error", "Invalid reset link");
                res.redirect('/forgot');
            } else {
                if (Number(Date.now()) <= foundUser.resetExpire) {
                    res.render("user/changePassword", { token: req.params.token });
                } else {
                    req.flash("error", "Reset Link expired");
                    res.redirect('/forgot');
                }
            }
        });
    }

});
// ----------------------
//  post change password
// ----------------------
router.post('/reset/:token', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/dashboard');
    } else {
        User.findOne({ resetToken: req.params.token }, function (err, foundUser) {
            if (err || !foundUser) {
                req.flash("error", "Something went wrong");
                res.redirect('/forgot');
            } else {
                if (Number(Date.now()) <= foundUser.resetExpire) {
                    foundUser.setPassword(req.body.newpassword, function (err) {
                        if (err) {
                            req.flash("error", "Error changing password");
                            res.redirect('/reset/' + req.params.token);
                        } else {
                            foundUser.resetToken = undefined;
                            foundUser.resetExpire = undefined;
                            foundUser.save();
                            req.flash("success", "password changed succesfully ..login now to confirm");
                            res.redirect("/login");
                        }
                    });
                } else {
                    foundUser.resetToken = undefined;
                    foundUser.resetExpire = undefined;
                    foundUser.save();
                    req.flash("error", "Reset Link expired");
                    res.redirect('/forgot');
                }
            }
        });
    }

});
module.exports = router;