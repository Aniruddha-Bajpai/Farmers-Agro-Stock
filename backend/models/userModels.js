const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // ---> builtin module

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 5 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false, // -> find() -> all data -> but we want only selected data -> would give all teh data except password
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// event callback before saving the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    // dont encrypt again if the password is not modified
    // no need to hash the already hashed password
    next();
  }
  this.password = await bcrypt.hash(this.password, 10); // 10 characters password to make it more strongger
});

// JWT TOKEN : to allow user to access the route after login
// JWT_SECRET : anyone with this key would be able access your website
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE, // -> will automatically expire the session after a given time, incase the user forgot to login
  });
};

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex"); // ---> generates token of 20 random bytes

  // Hashing and adding to user schema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // --> time till the resetToken would be valid in milliseconds
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);

/**

const auctionModel = new mongoose.Schema({
  name: {
    type: String,
    required: [true, ""]
  },
  chat: [
    {
      mes
    }
  ]
})


 */
