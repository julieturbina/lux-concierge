// const passport = require("passport");
// const ensureLogin = require("connect-ensure-login");
// const express = require("express");
// const authRoutes = express.Router();
// const Procedure = require('../models/procedure.js');

// // User model
// const User           = require("../models/user");

// // BCrypy encrypt passwords
// const bcrypt         = require("bcrypt");
// const bcryptSalt     = 10;

// //FACEBOOK SIGNIN ROUTE ========== not in use

// // authRoutes.get("/auth/facebook", passport.authenticate("facebook"));
// // authRoutes.get("/auth/facebook/callback", passport.authenticate("facebook", {
// //   successRedirect: "/private",
// //   failureRedirect: "/"
// // }));

// //LOGOUT ROUTE ===

// authRoutes.get("/logout", (req, res) => {
//     req.logout();
//     res.redirect("/");
//   });


//   // Signup Route ===
// authRoutes.get("/signup", (req, res, next) => {
//     res.render("auth/signup");
//   });
  
//   authRoutes.post("/signup", (req, res, next) => {
//       const username = req.body.username;
//       const password = req.body.password;
  
//       if (username === "" || password === "") {
//         res.render("auth/signup", { message: "Enter username and password" });
//         return;
//       }
        
//       User.findOne({ username })
//       .then(user => {
//         if (user !== null) {
//           res.render("auth/signup", { message: "The username already exists" });
//           return;
//         }
    
  
//       const salt     = bcrypt.genSaltSync(bcryptSalt);
//       const hashPass = bcrypt.hashSync(password, salt);
      
//       const newUser = new User({
//         username,
//         password: hashPass
//       });
  
//       newUser.save((err) => {
//         if (err) {
//           res.render("auth/signup", { message: "Something went wrong" });
//         } else {
//           res.redirect("/procedures");
//         }
//       });
//     })
//     .catch(error => {
//       next(error);
//     });
//   });

//   //LOGIN ROUTE ===

// authRoutes.get("/login", (req, res, next) => {
//     res.render("auth/login", { "message": req.flash("error") });
//   });
  
//   authRoutes.post("/login", passport.authenticate("local", 
//   {
//     successRedirect: "/procedures",
//     failureRedirect: "/login",
//     failureFlash: true,
//     passReqToCallback: true
//   }));
  
//   authRoutes.post("/login", (req, res, next) => {
//     const username = req.body.username;
//     const password = req.body.password;
  
//     if (username === "" || password === "") {
//       res.render("auth/login", {
//         errorMessage: "Indicate a username and a password to sign up"
//       });
//       return;
//     }
  
//     User.findOne({ "username": username }, (err, user) => {
//         if (err || !user) {
//           res.render("auth/login", {
//             errorMessage: "The username doesn't exist"
//           });
//           return;
//         }
//         if (bcrypt.compareSync(password, user.password)) {
//           // Save the login in the session!
//           req.session.currentUser = user;
//           res.redirect("/layout");
//         } else {
//           res.render("auth/login", {
//             errorMessage: "Incorrect password"
//           });
//         }
//         authRoutes.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
//           res.render("procedures", { user: req.user });
//         });
  
//         authRoutes.get("/logout", (req, res) => {
//           req.logout();
//           res.redirect("/");
//         });
  
//     });
//   });

//   module.exports = authRoutes;

// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user');
const bcryptSalt = 10;


router.get('/signup', (req, res, next) => {
  res.render('auth/signup', {
    errorMessage: ''
  });
});

router.get('/login', (req, res, next) => {
    res.render('auth/login', {
      errorMessage: ''
    });
  });

router.post('/signup', (req, res, next) => {
    const {name, email, password} = req.body;
  
    if (email === '' || password === '') {
      res.render('auth/signup', {
        errorMessage: 'Enter both email and password to sign up.'
      });
      return;
    }
  
    User.findOne({ email }, '_id', (err, existingUser) => {
      if (err) {
        next(err);
        return;
      }
  
      if (existingUser !== null) {
        res.render('auth/signup', {
          errorMessage: `The email ${email} is already in use.`
        });
        return;
      }
  
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashedPass = bcrypt.hashSync(password, salt);
    
      const theUser = new User({
        name,
        email,
        password: hashedPass
      });
  
      theUser.save((err) => {
        if (err) {
          res.render('auth/signup', {
            errorMessage: `Something went wrong. Try again later. + ${err}`,
          });
          return;
        }
  
        res.redirect('/');
      });
    });
  });

  router.post('/login', (req, res, next) => {
    const {email, password} = req.body;
  
    if (email === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Enter both email and password to log in.'
      });
      return;
    }
  
    User.findOne({ email }, (err, theUser) => {
      if (err || theUser === null) {
        res.render('auth/login', {
          errorMessage: `There isn't an account with email ${email}.`
        });
        return;
      }
  
      if (!bcrypt.compareSync(password, theUser.password)) {
        res.render('auth/login', {
          errorMessage: 'Invalid password.'
        });
        return;
      }
  
      req.session.currentUser = theUser;
      res.redirect('/');
    });
  });

  router.get('/logout', (req, res, next) => {
    if (!req.session.currentUser) {
      res.redirect('/');
      return;
    }
  
    req.session.destroy((err) => {
      if (err) {
        next(err);
        return;
      }
  
      res.redirect('/');
    });
  });

module.exports = router;