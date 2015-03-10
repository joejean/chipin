passport = require('passport-oauth');

passport.use(new OAuth2Strategy({
    authorizationURL: 'http://passport.sg.nyuad.org/visa/oauth/authorize',
    tokenURL: 'http://passport.sg.nyuad.org/visa/oauth/token',
    clientID: EXAMPLE_CLIENT_ID,
    clientSecret: EXAMPLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/nyu/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ exampleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));



