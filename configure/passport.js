var User = require("../models/user"),
    // config = require("./configure"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    FacebookStrategy = require('passport-facebook').Strategy;

// PASSPORT SERIALIZE AND DESERIALIZE
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// ---------------------------
//     LOCAL STRATEGY
// ---------------------------
passport.use(new LocalStrategy(User.authenticate()));

// ---------------------------
//     GOOGLE LOGIN STRATEGY
// ---------------------------
passport.use(new GoogleStrategy({

    clientID: process.env.AUTHORIZATION_GOOGLE_CLIENTID,
    clientSecret: process.env.AUTHORIZATION_GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.AUTHORIZATION_GOOGLE_CALLBACKURL,
    passReqToCallback: true

}, function (req, accessToken, refreshToken, profile, done) {
    process.nextTick(function () {

        // if someone is already logged in
        if (req.user) {
            var user = req.user;

            // if profile email and google email match then
            // link google else show error
            if (user.email === profile.emails[0].value) {
                user.google.id = profile.id;
                user.google.name = profile.displayName;
                user.google.email = profile.emails[0].value;
                user.google.photo = profile.photos ? profile.photos[0].value : './public/images/noprofile.png';
                user.save(function (err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });
            } else {
                req.flash("error", "provided email do not match");
                return done(null, user);
            }
        } else {
            // try to find the user based on their google id
            User.findOne({ 'google.id': profile.id }, function (err, user) {
                if (err)
                    return done(err);
                if (user) {
                    // if found then return user
                    return done(null, user);
                } else {
                    // find a user with profile email same as google mail
                    // and link google to their profile
                    User.findOne({ email: profile.emails[0].value }, function (err, user) {
                        if (!err && user) {
                            user.google.id = profile.id;
                            user.google.name = profile.displayName;
                            user.google.email = profile.emails[0].value; // pull the first email                        
                            user.google.photo = profile.photos ? profile.photos[0].value : './public/images/noprofile.png';
                            user.save(function (err) {
                                if (err)
                                    throw err;
                                return done(null, user);
                            });
                        } else {
                            // create a new user with google fields
                            var newUser = new User();
                            newUser.google.id = profile.id;
                            newUser.google.name = profile.displayName;
                            newUser.google.email = profile.emails[0].value;
                            newUser.email = newUser.google.email;
                            newUser.google.photo = profile.photos ? profile.photos[0].value : './public/images/noprofile.png';
                            newUser.username = profile.displayName;
                            newUser.fullName = profile.name.givenName + ' ' + profile.name.familyName;
                            newUser.save(function (err) {
                                if (err)
                                    throw err;
                                return done(null, user);
                            });
                        }
                    });
                }
            });
        }
    });
}
));

// ---------------------------
//   FACEBOOK LOGIN STRATEGY
// ---------------------------
passport.use(new FacebookStrategy({

    clientID: process.env.AUTHORIZATION_FACEBOOK_CLIENTID,
    clientSecret: process.env.AUTHORIZATION_FACEBOOK_CLIENTSECRET,
    callbackURL: process.env.AUTHORIZATION_FACEBOOK_CALLBACKURL,
    profileFields: ['id', 'displayName', 'name', 'picture.type(large)', 'email'],
    passReqToCallback: true,
    enableProof: true

}, function (req, token, refreshToken, profile, done) {
    process.nextTick(function () {

        // if some is already logged in
        if (req.user) {
            var user = req.user;

            // if profile email match then link to facebook
            // else show error
            if (profile.emails && user.email === profile.emails[0].value) {
                user.facebook.id = profile.id;
                user.facebook.name = profile.displayName;
                user.facebook.email = profile.emails[0].value; // pull the first email                        
                user.facebook.photo = profile.photos ? profile.photos[0].value : './public/images/noprofile.png';
                user.save(function (err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });
            } else {
                req.flash("error", "provided email do not match...use correct account");
                return done(null, user);
            }
        } else {

            // find the user in the database based on their facebook id
            User.findOne({ 'facebook.id': profile.id }, function (err, user) {
                if (err)
                    return done(err);
                if (user) {
                    return done(null, user);
                } else {
                    // find user with same profile email and link facebook
                    User.findOne({ email: profile.emails[0].value }, function (err, user) {
                        if (!err && user) {
                            user.facebook.id = profile.id;
                            user.facebook.token = token;
                            user.facebook.name = profile.displayName;
                            user.facebook.photo = profile.photos ? profile.photos[0].value : './public/images/noprofile.png';
                            user.facebook.email = profile.emails[0].value;
                            user.save(function (err) {
                                if (err)
                                    throw err;
                                return done(null, user);
                            });
                        } else {

                            // create new user with facebook fields
                            var newUser = new User();
                            newUser.facebook.id = profile.id;
                            newUser.facebook.token = token;
                            newUser.facebook.name = profile.displayName;
                            newUser.facebook.photo = profile.photos ? profile.photos[0].value : './public/images/noprofile.png';
                            if (profile.emails) {
                                newUser.facebook.email = profile.emails[0].value;
                                newUser.email = newUser.facebook.email;
                            }
                            newUser.fullName = profile.name.givenName + ' ' + profile.name.familyName;
                            newUser.username = newUser.facebook.name;
                            newUser.save(function (err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            });
                        }
                    });
                }
            });
        }
    });

}));