var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var passport = require("passport");
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var expressSession = require("express-session");
var nunjucks = require("nunjucks");
var api = require("./routes/api");
var User = require("./models/user");
var config = require("./config");
var index = require('./routes/index');
var attachAuthenticationStatus = require("./middlewares/attachAuthenticationStatus");
require('coffee-script/register') // <-- This dependency is to be removed very soon.
penguin = require('penguin')
admin = new penguin.Admin()



var app = express();
//for Penguin Admin
admin.setupApp(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'nunjucks');
nunjucks.configure("views", {
    autoescape: true,
    express: app 

});

console.log("at app.js");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//Connect to DB
mongoose.connect(config.db.uri);


// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession( { 
    secret: config.session.secret, 
    resave: false,
    saveUninitialized: true 
} ));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(attachAuthenticationStatus);

//Our Routes
app.use('/', index);
app.use('/api', api);

//Google Oauth Config
passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    //var netID = (profile.emails[0].value).split('@')[0];
    console.log(profile);
    User.findOne({email: profile.emails[0].value},
      function (err, user) {
      if(err){
        return done(err);
      }
      if(!user){

        user = new User({email: profile.emails[0].value, name: profile.displayName});
        user.save(function(err){
          if(err) console.log(err);
          return done(err,user);
        });
      }
      else{
        return done(err, user);
      }
      
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if(err){
      done(err, user);
    } else{
      done(null, user);
    } 
  });
});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//**** error handlers ****//

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error.html', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.html', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
