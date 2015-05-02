
// middlewares/attachAuthenticationStatus.js
// This middleware makes the login status of the users available
// to our views.
function attachAuthenticationStatus(req,res,next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  next()
}

module.exports = attachAuthenticationStatus;