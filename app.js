require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
// const Provider     = require('./models/procedure');   test prior to uncommenting
const Procedure     = require('./models/procedure');
const User     = require('./models/user');


const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");

//FACEBOOK =================================
// const FbStrategy = require('passport-facebook').Strategy;


// const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
// const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

const bcrypt     = require("bcrypt");
const saltRounds = 10;

const plainPassword1 = "HelloWorld";
const plainPassword2 = "helloworld";

const salt  = bcrypt.genSaltSync(saltRounds);
const hash1 = bcrypt.hashSync(plainPassword1, salt);
const hash2 = bcrypt.hashSync(plainPassword2, salt);

const MongoStore = require('connect-mongo')(session);

////auth transfer end==================================
mongoose.Promise = Promise;
mongoose
  .connect(process.env.MONGODB_URI, {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!');
  }).catch(err => {
    console.error('Error connecting to mongo', err);
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: "lux-concierge",
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 600000000 },
  store: new MongoStore({
  mongooseConnection: mongoose.connection,
  ttl: 24 * 60 * 60 // 1 day
})
}));

app.use(passport.initialize());
app.use(passport.session());

//FACEBOOK START=======================
// passport.use(new FbStrategy({
//   clientID: FACEBOOK_APP_ID,
//   clientSecret: FACEBOOK_APP_SECRET,
//   callbackURL: "/auth/facebook/callback"
// }, (accessToken, refreshToken, profile, done) => {
//   User.findOne({ facebookID: profile.id }, (err, user) => {
//     if (err) {
//       return done(err);
//     }
//     if (user) {
//       return done(null, user);
//     }

//     const newUser = new User({
//       facebookID: profile.id
//     });

//     newUser.save((err) => {
//       if (err) {
//         return done(err);
//       }
//       done(null, newUser);
//     });
//   });

// }));

//FACEBOOK END=======================
passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

app.use(flash());

passport.use(new LocalStrategy({
  passReqToCallback: true
}, (req, username, password, next) => {
  User.findOne({ username }, (err, user) => {
    console.log('user from app is: ', user);
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }

    return next(null, user);
  });
}));

//DUPLICATED FROM ABOVE = COMMENTED FOR TESTING =========

// app.use(passport.initialize());
// app.use(passport.session());
//========================================================
// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

hbs.registerPartials(__dirname + '/views/partials');

//GET static files

//Get home page===
app.get('/', (req, res, next) => {
  res.render('index');
});

// default value for title local
app.locals.title = 'Lux-Concierge';

// Routes
const index = require('./routes/index');
const authRoutes = require('./routes/auth-routes');

app.use('/', index);
app.use('/', authRoutes);



module.exports = app; 