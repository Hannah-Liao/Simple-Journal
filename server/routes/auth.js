const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/User");
const authController = require("../controllers/authController");
const { checkAuthentication } = require("../middleware/checkAuth");


//////// Local ////////
const authenticateUser = async (email, password, done) => {
    User.findOne({ email: email }).then((user) => {
        if (!user) {
            return done(null, false, { message: "No user with that email" })
        }
        if (bcrypt.compareSync(password, user.password)) {
            return done(null, user)
        } else {
            return done(null, false, { message: "Password incorrect" })
        }
    }).catch(err => { done(err) })
}

passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));


router.get("/login", checkAuthentication, authController.login);
router.post("/login", checkAuthentication, passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/dashboard',
    failureFlash: true
}));

router.get("/register", checkAuthentication, authController.register);
router.post("/register", checkAuthentication, authController.registerSubmit);


//////// Google  //////// 
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
    async function (accessToken, refreshToken, profile, done) {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.giveName,
            lastName: profile.name.familyName,
            profileImage: profile.photos[0].value
        };

        try {
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                done(null, user);
            } else {
                user = await User.create(newUser);
                done(null, user);
            }
        } catch (err) {
            console.log(err)
        }
    }
));

/// Google Login Routes ///
router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/google/callback', passport.authenticate('google',
    {
        failureRedirect: '/login',
        successRedirect: '/dashboard'
    }),
);

/// destroy user session ///
router.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            res.send("Error log out")
        } else {
            res.redirect("/");
        }
    })
});

/// Presist user data after successful authentication ///
passport.serializeUser((user, done) => {
    done(null, user.id);
});

/// Retrieve user data from session
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

module.exports = router;