const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModels");
const ErrorHandler = require("../utils/errorhandler");
exports.isAuthenticatedUser = catchAsyncErrors(async function (req, res, next) {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET); // --> decoded data based on our hashed secret key
  req.user = await User.findById(decodedData.id);
  next();
});

exports.authoriseRoles = function (...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // if the given role is not admin
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
