const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModels"); // ---> acquiring user model structure instance
const crypto = require("crypto");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const cloduinary = require("cloudinary");
// ----> register user
exports.registerUser = catchAsyncErrors(async function (req, res, next) {
  const myCloud = await cloduinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id, // --> temp id
      url: myCloud.secure_url, // --> temp url
    },
  });

  sendToken(user, 201, res);
});

// ----> login user
exports.loginUser = catchAsyncErrors(async function (req, res, next) {
  const { email, password } = req.body;
  // checking if the user has given password and email both
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400)); // ---> sending our custom to enter both email and password satifying the requiremnts
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401)); // ---> to only hacker to be able to retrieve any valid user credentials using brute force dummy credentials
  }
  sendToken(user, 200, res);
  // const token = user.getJWTToken();
  // res.status(200).json({
  //   success: true,
  //   token,
  // });
});

// ----> Logout user
exports.logout = catchAsyncErrors(async function (req, res, next) {
  // --> clearing the current token to null and expiring it now
  res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });

  res.status(200).json({
    success: true,
    message: "logged out successfully",
  });
});

// ----> Forgot Password
exports.forgotPassword = catchAsyncErrors(async function (req, res, next) {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // ---> get reset password token which we created
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is : \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore it `;

  try {
    await sendEmail({
      email: user.email,
      subject: `FarmersMandi Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email send to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// ----> Reset Password
exports.resetPassword = catchAsyncErrors(async function (req, res, next) {
  // created token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Reset password is invalid or has been expired", 400)
    );
  }
  // --> when user does not give same credentials for password and confirm-password
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }
  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save();
  sendToken(user, 200, res); // ---> user will be login after the password is reset
});

// ----> Get user details of self ---> this route will only exists if the user data exists
exports.getUserDetails = catchAsyncErrors(async function (req, res, next) {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

exports.updatePassword = catchAsyncErrors(async function (req, res, next) {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password doest not match"), 400);
  }
  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});

exports.updateUserProfile = catchAsyncErrors(async function (req, res, next) {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  // we will add cloduinary later

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// ----> Get all users(admin)
exports.getAllUser = catchAsyncErrors(async function (req, res, next) {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// ----> Get single user(admin) --> functionality for admin to get the details of the user(excluding security credentials)
exports.getSingleUser = catchAsyncErrors(async function (req, res, next) {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// ----> To update user role -- admin
exports.updateUserRole = catchAsyncErrors(async function (req, res, next) {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  // we will add cloduinary later

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// ----> To delete a user -- admin
exports.deleteUser = catchAsyncErrors(async function (req, res, next) {
  const user = await User.findById(req.params.id);
  // we will remove cloduinary later
  if (!user) {
    return next(
      new ErrorHandler(`user does not exist with id: ${req.params.id}`, 404)
    );
  }
  await user.deleteOne();
  res.status(200).json({
    success: true,
    message: `User deleted successfully`,
  });
});
