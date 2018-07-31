const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const express = require("express");
const authRoutes = express.Router();
const Procedure = require('../models/procedure.js');

// User model
const User           = require("../models/user");

// BCrypy encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

//FACEBOOK SIGNIN ROUTE ========== not in use

// authRoutes.get("/auth/facebook", passport.authenticate("facebook"));
// authRoutes.get("/auth/facebook/callback", passport.authenticate("facebook", {
//   successRedirect: "/private",
//   failureRedirect: "/"
// }));

//LOGOUT ROUTE ===

authRoutes.get("/logout", (req, res) => {
  console.log('who is user: ', req.user);
    req.logout();
    console.log('user is blahhhhh: ', req.user);
    res.redirect("/login");
  });


  // Signup Route ===
authRoutes.get("/signup", (req, res, next) => {
    res.render("auth/signup");
  });
  
  authRoutes.post("/signup", (req, res, next) => {
      const username = req.body.username;
      const password = req.body.password;
  
      if (username === "" || password === "") {
        res.render("auth/signup", { message: "Enter username and password" });
        return;
      }
        
      User.findOne({ username })
      .then(user => {
        if (user !== null) {
          res.render("auth/signup", { message: "The username already exists" });
          return;
        }
    
  
      const salt     = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      
      const newUser = new User({
        username,
        password: hashPass
      });
  
      newUser.save((err) => {
        if (err) {
          res.render("auth/signup", { message: "Something went wrong" });
        } else {
          res.redirect("/private");
        }
      });
    })
    .catch(error => {
      next(error);
    });
  });

  //LOGIN ROUTE ===

authRoutes.get("/login", (req, res, next) => {
    res.render("auth/login", { "message": req.flash("error") });
  });
  
  authRoutes.post("/login", passport.authenticate("local", 
  {
    successRedirect: "/private",
    failureRedirect: "auth/login",
    failureFlash: true,
    passReqToCallback: true
  }));
  
  authRoutes.post("/login", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username === "" || password === "") {
      res.render("auth/login", {
        errorMessage: "Indicate a username and a password to sign up"
      });
      return;
    }
  
    User.findOne({ "username": username }, (err, user) => {
        if (err || !user) {
          res.render("/login", {
            errorMessage: "The username doesn't exist, please signup"
          });
          return;
        }
        if (bcrypt.compareSync(password, user.password)) {
          // Save the login in the session!
          req.session.currentUser = user;
          res.redirect("/private");
        } else {
          res.render("auth/login", {
            errorMessage: "Incorrect password"
          });
        }
        authRoutes.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
          res.render("private", { user: req.user });
        });
  
        authRoutes.get("/logout", (req, res) => {
          req.logout();
          res.redirect("/");
        });
  
    });
  });

  module.exports = authRoutes;