const passport = require("passport");

exports.checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: "Forbidden: You donot have access to this!" });
  }
  next();
};

exports.checkAuthentication = () => (req, res, next) => {
  passport.authenticate("jwt", { session: false }, function (err, user, info) {
    if (err) return next(err);
    if (!user)
      return res.status(401).json({ message: "Unauthorized: Login to continue!" });
    req.user = user;
    next();
  })(req, res, next);
};
