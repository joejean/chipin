var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var passport = require("passport");
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var expressSession = require("express-session");
var nunjucks = require("nunjucks");
var User = require("./models/user");
var config = require("./config");
var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'nunjucks');
nunjucks.configure("views", {
    autoescape: true,
    express: app 

});

//Connect to DB
mongoose.connect(config.db.uri);




// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
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

app.use('/', index);


//Passport Strategy Configuration
passport.use(new OAuth2Strategy({
    authorizationURL: config.oauth.authorizationURL,
    tokenURL: config.oauth.tokenURL,
    clientID: config.oauth.clientID,
    clientSecret: config.oauth.clientSecret,
    callbackURL: "http://127.0.0.1:3000/login/callback",
    scope:['netID', 'school', 'class', "name"],
    profileFields: ['netID', 'school', 'class', "name"]
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ netID: profile.netID },
      function (err, user) {
      if(err){
        return done(err);
      }
      if(!user){
        user = new User({netID: profile.netID, name: profile.name});
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
    User.findById(id, function(err, user){
       done(err, user); 
    });
  
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
